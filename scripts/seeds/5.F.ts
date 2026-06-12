import type { SeedProblem } from './types';
import type { Diagram } from '../../src/types/problem';

// 5.F — Gr-5 Foundations (SRVUSD 5th-grade MAP coverage).
// 6 units × 10: place value & whole-number ops, fraction +/-, fraction ×/÷,
// decimals, measurement & volume, coordinate plane & patterns & line plots.
// Every answer is recomputed in the explanation steps; difficulty-3 problems
// carry a 4-step titled hint series.

// ---------- inline-SVG diagram helpers ----------

function fracBar(den: number, shaded: number, label: string): Diagram {
  const w = 260;
  const h = 44;
  const cw = w / den;
  let cells = '';
  for (let i = 0; i < den; i++) {
    const fill = i < shaded ? '#14B8A6' : '#fff';
    cells += `<rect x="${(i * cw).toFixed(1)}" y="4" width="${cw.toFixed(1)}" height="36" fill="${fill}" stroke="#0f172a" stroke-width="1.5"/>`;
  }
  return {
    kind: 'inline-svg',
    svg: `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${cells}</svg>`,
    alt: label,
  };
}

function twoFracBars(d1: number, s1: number, d2: number, s2: number, label: string): Diagram {
  const w = 260;
  const bar = (den: number, shaded: number, y: number) => {
    const cw = w / den;
    let cells = '';
    for (let i = 0; i < den; i++) {
      const fill = i < shaded ? '#14B8A6' : '#fff';
      cells += `<rect x="${(i * cw).toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="30" fill="${fill}" stroke="#0f172a" stroke-width="1.5"/>`;
    }
    return cells;
  };
  return {
    kind: 'inline-svg',
    svg: `<svg viewBox="0 0 ${w} 78" width="${w}" height="78" xmlns="http://www.w3.org/2000/svg">${bar(d1, s1, 4)}${bar(d2, s2, 42)}</svg>`,
    alt: label,
  };
}

function areaGrid(rows: number, cols: number, shaded: number, label: string): Diagram {
  const cell = 36;
  const w = cols * cell;
  const h = rows * cell;
  let cells = '';
  let n = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fill = n < shaded ? '#14B8A6' : '#fff';
      cells += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#0f172a" stroke-width="1.5"/>`;
      n++;
    }
  }
  return {
    kind: 'inline-svg',
    svg: `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${cells}</svg>`,
    alt: label,
  };
}

function labeledPrism(l: string, w: string, h: string, label: string): Diagram {
  return {
    kind: 'inline-svg',
    svg:
      `<svg viewBox="0 0 250 150" width="250" height="150" xmlns="http://www.w3.org/2000/svg">` +
      `<polygon points="40,50 160,50 160,120 40,120" fill="#ccfbf1" stroke="#0f172a" stroke-width="2"/>` +
      `<polygon points="40,50 80,25 200,25 160,50" fill="#99f6e4" stroke="#0f172a" stroke-width="2"/>` +
      `<polygon points="160,50 200,25 200,95 160,120" fill="#5eead4" stroke="#0f172a" stroke-width="2"/>` +
      `<text x="95" y="138" font-size="14" fill="#0f172a">${l}</text>` +
      `<text x="205" y="65" font-size="14" fill="#0f172a">${w}</text>` +
      `<text x="8" y="90" font-size="14" fill="#0f172a">${h}</text>` +
      `</svg>`,
    alt: label,
  };
}

function coordPlane(pts: [number, number][], max: number, label: string): Diagram {
  const size = 220;
  const pad = 24;
  const step = (size - 2 * pad) / max;
  const x = (v: number) => pad + v * step;
  const y = (v: number) => size - pad - v * step;
  let grid = '';
  for (let i = 0; i <= max; i++) {
    grid += `<line x1="${x(i)}" y1="${y(0)}" x2="${x(i)}" y2="${y(max)}" stroke="#cbd5e1" stroke-width="1"/>`;
    grid += `<line x1="${x(0)}" y1="${y(i)}" x2="${x(max)}" y2="${y(i)}" stroke="#cbd5e1" stroke-width="1"/>`;
    if (i > 0) {
      grid += `<text x="${x(i) - 4}" y="${y(0) + 16}" font-size="10" fill="#475569">${i}</text>`;
      grid += `<text x="${x(0) - 14}" y="${y(i) + 4}" font-size="10" fill="#475569">${i}</text>`;
    }
  }
  let dots = '';
  for (const [px, py] of pts) {
    dots += `<circle cx="${x(px)}" cy="${y(py)}" r="6" fill="#ef4444" stroke="#0f172a" stroke-width="1.5"/>`;
  }
  return {
    kind: 'inline-svg',
    svg:
      `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${grid}` +
      `<line x1="${x(0)}" y1="${y(0)}" x2="${x(max)}" y2="${y(0)}" stroke="#0f172a" stroke-width="2"/>` +
      `<line x1="${x(0)}" y1="${y(0)}" x2="${x(0)}" y2="${y(max)}" stroke="#0f172a" stroke-width="2"/>` +
      `${dots}</svg>`,
    alt: label,
  };
}

function linePlot(counts: { pos: number; n: number; lab: string }[], label: string): Diagram {
  const w = 260;
  const y0 = 96;
  let marks = '';
  for (const { pos, n, lab } of counts) {
    const cx = 30 + pos * 200;
    for (let i = 0; i < n; i++) {
      marks += `<text x="${cx - 5}" y="${y0 - 14 - i * 16}" font-size="14" fill="#0f172a">X</text>`;
    }
    marks += `<line x1="${cx}" y1="${y0 - 4}" x2="${cx}" y2="${y0 + 4}" stroke="#0f172a" stroke-width="2"/>`;
    marks += `<text x="${cx - 10}" y="${y0 + 20}" font-size="12" fill="#0f172a">${lab}</text>`;
  }
  return {
    kind: 'inline-svg',
    svg:
      `<svg viewBox="0 0 ${w} 124" width="${w}" height="124" xmlns="http://www.w3.org/2000/svg">` +
      `<line x1="20" y1="${y0}" x2="${w - 20}" y2="${y0}" stroke="#0f172a" stroke-width="2"/>${marks}</svg>`,
    alt: label,
  };
}

export const problems5F: SeedProblem[] = [
  // ============ UNIT 1 — Place value & whole-number operations ============
  {
    domain: '5.F', num: 1, unit: 1, order: 1, slug: 'place-value-7',
    standard: '5.NBT.A.1', difficulty: 1,
    prompt: 'In the number $47{,}283$, what is the **value** of the digit $7$?',
    answerType: 'numeric', primaryAnswer: '7000', alternativeAnswers: ['7,000'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Which place is the $7$ sitting in? Count from the right: ones, tens, hundreds…' },
      { level: 'guide', text: 'The $7$ is in the thousands place, so its value is $7 \\times 1000$.' },
      { level: 'reveal', text: '$7 \\times 1000 = 7000$.' },
    ],
    explanation: [
      'Reading $47{,}283$ from the right: $3$ ones, $8$ tens, $2$ hundreds, $7$ thousands, $4$ ten-thousands.',
      'The digit $7$ is in the **thousands** place.',
      'So its value is $7 \\times 1000 = 7000$.',
    ],
    alternativeExplanations: [
      { title: 'Expanded form', steps: ['$47{,}283 = 40{,}000 + 7{,}000 + 200 + 80 + 3$.', 'The piece that comes from the $7$ is $7{,}000$.'] },
    ],
    tags: ['MAP-practice', 'place-value'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 2, unit: 1, order: 2, slug: 'divide-by-10',
    standard: '5.NBT.A.2', difficulty: 1,
    prompt: 'What is $6{,}000 \\div 10$?',
    answerType: 'numeric', primaryAnswer: '600', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Dividing by $10$ shifts every digit one place to the right.' },
      { level: 'guide', text: 'One zero disappears: $6{,}000 \\to 600$.' },
      { level: 'reveal', text: '$6{,}000 \\div 10 = 600$.' },
    ],
    explanation: [
      'Dividing by $10$ makes a number ten times smaller — each digit moves one place to the right.',
      '$6{,}000 \\div 10 = 600$.',
    ],
    tags: ['place-value', 'powers-of-ten'], estimatedSeconds: 25,
  },
  {
    domain: '5.F', num: 3, unit: 1, order: 3, slug: 'power-of-ten',
    standard: '5.NBT.A.2', difficulty: 1,
    prompt: 'What is $10^3$?',
    answerType: 'numeric', primaryAnswer: '1000', alternativeAnswers: ['1,000'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$10^3$ means $10 \\times 10 \\times 10$.' },
      { level: 'guide', text: 'The exponent counts the zeros: $10^3$ has $3$ zeros.' },
      { level: 'reveal', text: '$10 \\times 10 \\times 10 = 1000$.' },
    ],
    explanation: [
      '$10^3 = 10 \\times 10 \\times 10$.',
      '$10 \\times 10 = 100$, and $100 \\times 10 = 1000$.',
    ],
    alternativeExplanations: [
      { title: 'Zero-counting shortcut', steps: ['A power of ten has as many zeros as its exponent.', 'Exponent $3$ → three zeros → $1000$.'] },
    ],
    tags: ['powers-of-ten'], estimatedSeconds: 25,
  },
  {
    domain: '5.F', num: 4, unit: 1, order: 4, slug: 'multiply-38x27',
    standard: '5.NBT.B.5', difficulty: 2,
    prompt: 'Multiply: $38 \\times 27$',
    answerType: 'numeric', primaryAnswer: '1026', alternativeAnswers: ['1,026'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Break $27$ into $20 + 7$ and multiply each part by $38$.' },
      { level: 'guide', text: '$38 \\times 20 = 760$ and $38 \\times 7 = 266$. Add them.' },
      { level: 'reveal', text: '$760 + 266 = 1026$.' },
    ],
    explanation: [
      'Split $27$ into $20 + 7$.',
      '$38 \\times 20 = 760$.',
      '$38 \\times 7 = 266$.',
      '$760 + 266 = 1026$.',
    ],
    alternativeExplanations: [
      { title: 'Area model', steps: ['Draw a box split into $30 + 8$ across and $20 + 7$ down.', 'The four parts: $600, 160, 210, 56$.', '$600 + 160 + 210 + 56 = 1026$.'] },
    ],
    tags: ['MAP-practice', 'multiplication'], estimatedSeconds: 70,
  },
  {
    domain: '5.F', num: 5, unit: 1, order: 5, slug: 'divide-504-8',
    standard: '5.NBT.B.6', difficulty: 2,
    prompt: 'Divide: $504 \\div 8$',
    answerType: 'numeric', primaryAnswer: '63', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'How many $8$s fit in $50$? Start there.' },
      { level: 'guide', text: '$8 \\times 6 = 48$, so $8 \\times 60 = 480$. How much is left over from $504$?' },
      { level: 'reveal', text: '$504 - 480 = 24$, and $24 \\div 8 = 3$, so $60 + 3 = 63$.' },
    ],
    explanation: [
      '$8 \\times 60 = 480$ — that uses up most of $504$.',
      '$504 - 480 = 24$.',
      '$24 \\div 8 = 3$.',
      'So $504 \\div 8 = 60 + 3 = 63$.',
    ],
    alternativeExplanations: [
      { title: 'Check by multiplying', steps: ['Try $63 \\times 8$.', '$60 \\times 8 = 480$ and $3 \\times 8 = 24$.', '$480 + 24 = 504$ ✓'] },
    ],
    tags: ['division'], estimatedSeconds: 60,
  },
  {
    domain: '5.F', num: 6, unit: 1, order: 6, slug: 'divide-4329-9',
    standard: '5.NBT.B.6', difficulty: 2,
    prompt: 'Divide: $4{,}329 \\div 9$',
    answerType: 'numeric', primaryAnswer: '481', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Work place by place: how many $9$s in $43$ hundreds?' },
      { level: 'guide', text: '$9 \\times 400 = 3600$. Subtract, then keep dividing what is left.' },
      { level: 'reveal', text: '$4329 - 3600 = 729$; $9 \\times 80 = 720$; $9 \\times 1 = 9$. So $400 + 80 + 1 = 481$.' },
    ],
    explanation: [
      '$9 \\times 400 = 3600$, leaving $4329 - 3600 = 729$.',
      '$9 \\times 80 = 720$, leaving $729 - 720 = 9$.',
      '$9 \\times 1 = 9$, leaving $0$.',
      'So $4329 \\div 9 = 400 + 80 + 1 = 481$.',
    ],
    tags: ['division'], estimatedSeconds: 80,
  },
  {
    domain: '5.F', num: 7, unit: 1, order: 7, slug: 'order-of-ops',
    standard: '5.OA.A.1', difficulty: 2,
    prompt: 'Evaluate: $3 \\times (8 + 4) - 6$',
    answerType: 'numeric', primaryAnswer: '30', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Parentheses first!' },
      { level: 'guide', text: '$8 + 4 = 12$. Now the expression is $3 \\times 12 - 6$.' },
      { level: 'reveal', text: '$3 \\times 12 = 36$, then $36 - 6 = 30$.' },
    ],
    explanation: [
      'Parentheses first: $8 + 4 = 12$.',
      'Multiply: $3 \\times 12 = 36$.',
      'Subtract: $36 - 6 = 30$.',
    ],
    alternativeExplanations: [
      { title: 'Why parentheses matter', steps: ['Without parentheses, $3 \\times 8 + 4 - 6 = 24 + 4 - 6 = 22$ — a different answer!', 'Parentheses say: do this part first.'] },
    ],
    tags: ['MAP-practice', 'order-of-operations'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 8, unit: 1, order: 8, slug: 'multiply-25x49',
    standard: '5.NBT.B.5', difficulty: 2,
    prompt: 'Multiply: $25 \\times 49$',
    answerType: 'numeric', primaryAnswer: '1225', alternativeAnswers: ['1,225'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$49$ is just one less than $50$ — that makes a shortcut possible.' },
      { level: 'guide', text: '$25 \\times 50 = 1250$. You multiplied one extra $25$, so take it back off.' },
      { level: 'reveal', text: '$1250 - 25 = 1225$.' },
    ],
    explanation: [
      'Use a friendly number: $49 = 50 - 1$.',
      '$25 \\times 50 = 1250$.',
      '$25 \\times 1 = 25$, so subtract it: $1250 - 25 = 1225$.',
    ],
    alternativeExplanations: [
      { title: 'Standard algorithm', steps: ['$25 \\times 9 = 225$.', '$25 \\times 40 = 1000$.', '$1000 + 225 = 1225$.'] },
    ],
    tags: ['multiplication', 'mental-math'], estimatedSeconds: 60,
  },
  {
    domain: '5.F', num: 9, unit: 1, order: 9, slug: 'pencil-boxes',
    standard: '5.NBT.B.5', difficulty: 3,
    prompt: 'A school orders $24$ boxes of pencils with $36$ pencils in each box. The office keeps $150$ pencils. How many pencils are left for the classrooms?',
    answerType: 'numeric', primaryAnswer: '714', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Two steps: first find the total pencils, then take away what the office keeps.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'If there were $2$ boxes of $36$, that would be $72$ pencils. Now scale the same idea up to $24$ boxes.' },
      { level: 'guide', text: 'Total: $24 \\times 36$. Try $24 \\times 36 = 24 \\times 30 + 24 \\times 6$.' },
      { level: 'reveal', text: '$24 \\times 36 = 720 + 144 = 864$. Then $864 - 150 = 714$.' },
    ],
    explanation: [
      'Step 1 — total pencils: $24 \\times 36$.',
      '$24 \\times 30 = 720$ and $24 \\times 6 = 144$, so the total is $720 + 144 = 864$.',
      'Step 2 — remove the office pencils: $864 - 150 = 714$.',
      'So $714$ pencils go to the classrooms.',
    ],
    alternativeExplanations: [
      { title: 'Estimate first', steps: ['$24 \\times 36$ is about $25 \\times 36 = 900$.', '$900 - 150 = 750$, so an answer near $714$ makes sense.'] },
    ],
    tags: ['MAP-practice', 'multi-step', 'word-problem'], estimatedSeconds: 100,
  },
  {
    domain: '5.F', num: 10, unit: 1, order: 10, slug: 'money-change',
    standard: '5.NBT.B.7', difficulty: 3,
    prompt: 'Jaylen pays for a $\\$13.87$ book with a $\\$50$ bill. How much change should he get?',
    answerType: 'numeric', primaryAnswer: '36.13', alternativeAnswers: ['$36.13'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Change means subtract: $50.00 - 13.87$.' },
      { level: 'nudge', title: '🔁 Another angle', text: 'Count UP from $13.87$: $+0.13$ gets to $14$, then $+36$ gets to $50$.' },
      { level: 'guide', text: 'Write $50$ as $50.00$ and line up the decimal points before subtracting.' },
      { level: 'reveal', text: '$50.00 - 13.87 = 36.13$.' },
    ],
    explanation: [
      'Write the money with two decimal places: $50.00 - 13.87$.',
      'Counting up is easiest: $13.87 + 0.13 = 14.00$.',
      '$14.00 + 36.00 = 50.00$.',
      'Total counted up: $0.13 + 36.00 = 36.13$. The change is $\\$36.13$.',
    ],
    alternativeExplanations: [
      { title: 'Column subtraction', steps: ['$50.00 - 13.87$: borrow across the zeros.', '$50.00 - 13.87 = 36.13$.'] },
      { title: 'Estimate check', steps: ['$50 - 14 = 36$, so $36.13$ is reasonable.'] },
    ],
    tags: ['MAP-practice', 'money', 'decimals'], estimatedSeconds: 80,
  },

  // ============ UNIT 2 — Add & subtract fractions ============
  {
    domain: '5.F', num: 11, unit: 2, order: 1, slug: 'add-same-den',
    standard: '5.NF.A.1', difficulty: 1,
    prompt: 'Add: $\\frac{1}{4} + \\frac{2}{4}$',
    diagram: fracBar(4, 3, 'A bar split into 4 equal parts with 3 shaded'),
    answerType: 'fraction', primaryAnswer: '3/4', alternativeAnswers: ['0.75', '75%'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The denominators match, so just add the numerators.' },
      { level: 'guide', text: '$1 + 2 = 3$ fourths.' },
      { level: 'reveal', text: '$\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$.' },
    ],
    explanation: [
      'Same denominator means the pieces are the same size.',
      'Add the counts: $1 + 2 = 3$ pieces.',
      'So the sum is $\\frac{3}{4}$.',
    ],
    tags: ['fractions', 'addition'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 12, unit: 2, order: 2, slug: 'sub-same-den',
    standard: '5.NF.A.1', difficulty: 1,
    prompt: 'Subtract and simplify: $\\frac{5}{6} - \\frac{2}{6}$',
    answerType: 'fraction', primaryAnswer: '1/2', alternativeAnswers: ['3/6', '0.5'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Same denominators — subtract the numerators.' },
      { level: 'guide', text: '$5 - 2 = 3$, so you have $\\frac{3}{6}$. Can it simplify?' },
      { level: 'reveal', text: '$\\frac{3}{6} = \\frac{1}{2}$.' },
    ],
    explanation: [
      '$\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6}$.',
      'Divide top and bottom by $3$: $\\frac{3}{6} = \\frac{1}{2}$.',
    ],
    tags: ['fractions', 'subtraction'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 13, unit: 2, order: 3, slug: 'add-unlike-halves-thirds',
    standard: '5.NF.A.1', difficulty: 2,
    prompt: 'Add: $\\frac{1}{2} + \\frac{1}{3}$',
    diagram: twoFracBars(2, 1, 3, 1, 'One bar showing one half, another bar showing one third'),
    answerType: 'fraction', primaryAnswer: '5/6', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The pieces are different sizes — find a common denominator first.' },
      { level: 'guide', text: 'Sixths work for both: $\\frac{1}{2} = \\frac{3}{6}$ and $\\frac{1}{3} = \\frac{2}{6}$.' },
      { level: 'reveal', text: '$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.' },
    ],
    explanation: [
      'A common denominator for $2$ and $3$ is $6$.',
      '$\\frac{1}{2} = \\frac{3}{6}$ and $\\frac{1}{3} = \\frac{2}{6}$.',
      '$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.',
    ],
    alternativeExplanations: [
      { title: 'Decimal check', steps: ['$\\frac{1}{2} = 0.5$ and $\\frac{1}{3} \\approx 0.333$.', '$0.5 + 0.333 \\approx 0.833 = \\frac{5}{6}$ ✓'] },
    ],
    tags: ['MAP-practice', 'fractions', 'common-denominator'], estimatedSeconds: 60,
  },
  {
    domain: '5.F', num: 14, unit: 2, order: 4, slug: 'sub-unlike',
    standard: '5.NF.A.1', difficulty: 2,
    prompt: 'Subtract: $\\frac{3}{4} - \\frac{1}{2}$',
    answerType: 'fraction', primaryAnswer: '1/4', alternativeAnswers: ['0.25', '25%'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Rewrite $\\frac{1}{2}$ as fourths.' },
      { level: 'guide', text: '$\\frac{1}{2} = \\frac{2}{4}$.' },
      { level: 'reveal', text: '$\\frac{3}{4} - \\frac{2}{4} = \\frac{1}{4}$.' },
    ],
    explanation: [
      '$\\frac{1}{2} = \\frac{2}{4}$.',
      '$\\frac{3}{4} - \\frac{2}{4} = \\frac{1}{4}$.',
    ],
    tags: ['fractions', 'subtraction'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 15, unit: 2, order: 5, slug: 'add-fifths-half',
    standard: '5.NF.A.1', difficulty: 2,
    prompt: 'Add: $\\frac{2}{5} + \\frac{1}{2}$',
    answerType: 'fraction', primaryAnswer: '9/10', alternativeAnswers: ['0.9', '90%'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'What denominator works for both fifths and halves?' },
      { level: 'guide', text: 'Tenths: $\\frac{2}{5} = \\frac{4}{10}$ and $\\frac{1}{2} = \\frac{5}{10}$.' },
      { level: 'reveal', text: '$\\frac{4}{10} + \\frac{5}{10} = \\frac{9}{10}$.' },
    ],
    explanation: [
      'The least common denominator of $5$ and $2$ is $10$.',
      '$\\frac{2}{5} = \\frac{4}{10}$ and $\\frac{1}{2} = \\frac{5}{10}$.',
      '$\\frac{4}{10} + \\frac{5}{10} = \\frac{9}{10}$.',
    ],
    alternativeExplanations: [
      { title: 'Decimal check', steps: ['$0.4 + 0.5 = 0.9 = \\frac{9}{10}$ ✓'] },
    ],
    tags: ['fractions', 'common-denominator'], estimatedSeconds: 55,
  },
  {
    domain: '5.F', num: 16, unit: 2, order: 6, slug: 'mixed-numbers-add',
    standard: '5.NF.A.1', difficulty: 2,
    prompt: 'Add: $1\\frac{1}{2} + 2\\frac{1}{3}$ (answer as a mixed number)',
    answerType: 'fraction', primaryAnswer: '3 5/6', alternativeAnswers: ['23/6'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Add the whole numbers and the fractions separately.' },
      { level: 'guide', text: 'Wholes: $1 + 2 = 3$. Fractions: $\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}$.' },
      { level: 'reveal', text: '$3 + \\frac{5}{6} = 3\\frac{5}{6}$.' },
    ],
    explanation: [
      'Split each mixed number: wholes $1 + 2 = 3$.',
      'Fractions: $\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.',
      'Put them together: $3\\frac{5}{6}$.',
    ],
    tags: ['fractions', 'mixed-numbers'], estimatedSeconds: 70,
  },
  {
    domain: '5.F', num: 17, unit: 2, order: 7, slug: 'sub-eighths',
    standard: '5.NF.A.1', difficulty: 2,
    prompt: 'Subtract: $\\frac{7}{8} - \\frac{3}{4}$',
    answerType: 'fraction', primaryAnswer: '1/8', alternativeAnswers: ['0.125'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Rewrite $\\frac{3}{4}$ as eighths.' },
      { level: 'guide', text: '$\\frac{3}{4} = \\frac{6}{8}$.' },
      { level: 'reveal', text: '$\\frac{7}{8} - \\frac{6}{8} = \\frac{1}{8}$.' },
    ],
    explanation: [
      '$\\frac{3}{4} = \\frac{6}{8}$.',
      '$\\frac{7}{8} - \\frac{6}{8} = \\frac{1}{8}$.',
    ],
    tags: ['fractions', 'subtraction'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 18, unit: 2, order: 8, slug: 'run-walk-total',
    standard: '5.NF.A.2', difficulty: 3,
    prompt: 'Maya ran $\\frac{2}{3}$ mile and walked $\\frac{3}{4}$ mile. How far did she travel in all? (mixed number)',
    answerType: 'fraction', primaryAnswer: '1 5/12', alternativeAnswers: ['17/12'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'You are combining two distances — that is addition.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'First try $\\frac{1}{3} + \\frac{1}{4}$: twelfths work, giving $\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$. Use the same denominators here.' },
      { level: 'guide', text: '$\\frac{2}{3} = \\frac{8}{12}$ and $\\frac{3}{4} = \\frac{9}{12}$.' },
      { level: 'reveal', text: '$\\frac{8}{12} + \\frac{9}{12} = \\frac{17}{12} = 1\\frac{5}{12}$.' },
    ],
    explanation: [
      'The least common denominator of $3$ and $4$ is $12$.',
      '$\\frac{2}{3} = \\frac{8}{12}$ and $\\frac{3}{4} = \\frac{9}{12}$.',
      '$\\frac{8}{12} + \\frac{9}{12} = \\frac{17}{12}$.',
      '$\\frac{17}{12} = 1\\frac{5}{12}$ miles.',
    ],
    alternativeExplanations: [
      { title: 'Estimate first', steps: ['$\\frac{2}{3}$ and $\\frac{3}{4}$ are each a bit less than $1$.', 'So the total should be a bit less than $2$ — and $1\\frac{5}{12}$ fits.'] },
    ],
    tags: ['MAP-practice', 'word-problem', 'fractions'], estimatedSeconds: 100,
  },
  {
    domain: '5.F', num: 19, unit: 2, order: 9, slug: 'pan-left',
    standard: '5.NF.A.2', difficulty: 3,
    prompt: 'A pan of brownies is whole. Sam eats $\\frac{1}{4}$ of the pan and Ava eats $\\frac{1}{3}$ of the pan. What fraction of the pan is **left**?',
    answerType: 'fraction', primaryAnswer: '5/12', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'First find how much was eaten in total.' },
      { level: 'nudge', title: '🔁 Another angle', text: 'Picture the pan cut into $12$ equal pieces. How many pieces is $\\frac{1}{4}$? How many is $\\frac{1}{3}$?' },
      { level: 'guide', text: 'Eaten: $\\frac{1}{4} + \\frac{1}{3} = \\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$.' },
      { level: 'reveal', text: 'Left: $1 - \\frac{7}{12} = \\frac{5}{12}$.' },
    ],
    explanation: [
      'Eaten in total: $\\frac{1}{4} + \\frac{1}{3}$.',
      'Twelfths: $\\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$.',
      'The whole pan is $\\frac{12}{12}$, so what remains is $\\frac{12}{12} - \\frac{7}{12} = \\frac{5}{12}$.',
    ],
    alternativeExplanations: [
      { title: '12-piece picture', steps: ['Cut the pan into 12 pieces.', 'Sam eats 3 pieces, Ava eats 4 — that is 7 gone.', '$12 - 7 = 5$ pieces left → $\\frac{5}{12}$.'] },
    ],
    tags: ['MAP-practice', 'word-problem', 'fractions'], estimatedSeconds: 100,
  },
  {
    domain: '5.F', num: 20, unit: 2, order: 10, slug: 'estimate-sum-mc',
    standard: '5.NF.A.2', difficulty: 2,
    prompt: 'Without computing exactly: $\\frac{7}{8} + \\frac{11}{12}$ is **closest** to which whole number?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '0', correct: false },
      { id: 'B', label: '1', correct: false },
      { id: 'C', label: '2', correct: true },
      { id: 'D', label: '3', correct: false },
    ],
    primaryAnswer: 'C', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'How big is each fraction compared with $1$?' },
      { level: 'guide', text: 'Both $\\frac{7}{8}$ and $\\frac{11}{12}$ are just a little less than $1$.' },
      { level: 'reveal', text: 'Almost $1$ plus almost $1$ is almost $2$ — choose $2$.' },
    ],
    explanation: [
      '$\\frac{7}{8}$ is only $\\frac{1}{8}$ away from $1$; $\\frac{11}{12}$ is only $\\frac{1}{12}$ away from $1$.',
      'So the sum is just a little less than $1 + 1 = 2$.',
      'The closest whole number is $2$.',
    ],
    alternativeExplanations: [
      { title: 'Decimal check', steps: ['$\\frac{7}{8} = 0.875$, $\\frac{11}{12} \\approx 0.917$.', 'Sum $\\approx 1.79$, closest to $2$ ✓'] },
    ],
    tags: ['MAP-practice', 'estimation', 'fractions'], estimatedSeconds: 50,
  },

  // ============ UNIT 3 — Multiply & divide fractions ============
  {
    domain: '5.F', num: 21, unit: 3, order: 1, slug: 'half-of-third',
    standard: '5.NF.B.4', difficulty: 1,
    prompt: 'Multiply: $\\frac{1}{2} \\times \\frac{1}{3}$',
    diagram: areaGrid(2, 3, 1, 'A 2-by-3 grid with 1 of the 6 cells shaded'),
    answerType: 'fraction', primaryAnswer: '1/6', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Multiply the tops, multiply the bottoms.' },
      { level: 'guide', text: '$1 \\times 1 = 1$ and $2 \\times 3 = 6$.' },
      { level: 'reveal', text: '$\\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$.' },
    ],
    explanation: [
      'Multiply numerators: $1 \\times 1 = 1$.',
      'Multiply denominators: $2 \\times 3 = 6$.',
      'So the product is $\\frac{1}{6}$ — half of a third of the grid.',
    ],
    alternativeExplanations: [
      { title: 'Grid picture', steps: ['Split a rectangle into 2 rows and 3 columns — 6 equal cells.', 'Half of one third is exactly 1 cell → $\\frac{1}{6}$.'] },
    ],
    tags: ['fractions', 'multiplication'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 22, unit: 3, order: 2, slug: 'whole-times-frac',
    standard: '5.NF.B.4', difficulty: 1,
    prompt: 'Multiply: $3 \\times \\frac{2}{5}$ (improper fraction or mixed number)',
    answerType: 'fraction', primaryAnswer: '6/5', alternativeAnswers: ['1 1/5', '1.2'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Three copies of $\\frac{2}{5}$.' },
      { level: 'guide', text: '$\\frac{2}{5} + \\frac{2}{5} + \\frac{2}{5} = \\frac{6}{5}$.' },
      { level: 'reveal', text: '$3 \\times \\frac{2}{5} = \\frac{6}{5} = 1\\frac{1}{5}$.' },
    ],
    explanation: [
      '$3 \\times \\frac{2}{5}$ means three copies of two-fifths.',
      '$2 \\times 3 = 6$ fifths → $\\frac{6}{5}$.',
      'As a mixed number: $1\\frac{1}{5}$.',
    ],
    tags: ['fractions', 'multiplication'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 23, unit: 3, order: 3, slug: 'frac-times-frac',
    standard: '5.NF.B.4', difficulty: 2,
    prompt: 'Multiply and simplify: $\\frac{2}{3} \\times \\frac{3}{4}$',
    answerType: 'fraction', primaryAnswer: '1/2', alternativeAnswers: ['6/12', '0.5'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Tops together, bottoms together — then simplify.' },
      { level: 'guide', text: '$\\frac{2 \\times 3}{3 \\times 4} = \\frac{6}{12}$.' },
      { level: 'reveal', text: '$\\frac{6}{12} = \\frac{1}{2}$.' },
    ],
    explanation: [
      '$\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12}$.',
      'Divide top and bottom by $6$: $\\frac{1}{2}$.',
    ],
    alternativeExplanations: [
      { title: 'Cancel first', steps: ['The $3$s cancel: $\\frac{2}{\\cancel{3}} \\times \\frac{\\cancel{3}}{4} = \\frac{2}{4}$.', '$\\frac{2}{4} = \\frac{1}{2}$.'] },
    ],
    tags: ['MAP-practice', 'fractions'], estimatedSeconds: 50,
  },
  {
    domain: '5.F', num: 24, unit: 3, order: 4, slug: 'whole-div-unit-frac',
    standard: '5.NF.B.7', difficulty: 2,
    prompt: 'Divide: $4 \\div \\frac{1}{3}$',
    answerType: 'numeric', primaryAnswer: '12', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Ask: how many thirds fit inside $4$ wholes?' },
      { level: 'guide', text: 'Each whole holds $3$ thirds, and there are $4$ wholes.' },
      { level: 'reveal', text: '$4 \\times 3 = 12$.' },
    ],
    explanation: [
      '$4 \\div \\frac{1}{3}$ asks how many $\\frac{1}{3}$-pieces fit in $4$.',
      'One whole = $3$ thirds, so four wholes = $4 \\times 3 = 12$ thirds.',
    ],
    alternativeExplanations: [
      { title: 'Keep-change-flip', steps: ['$4 \\div \\frac{1}{3} = 4 \\times \\frac{3}{1}$.', '$= 12$.'] },
    ],
    tags: ['fractions', 'division'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 25, unit: 3, order: 5, slug: 'unit-frac-div-whole',
    standard: '5.NF.B.7', difficulty: 2,
    prompt: 'Divide: $\\frac{1}{2} \\div 4$',
    answerType: 'fraction', primaryAnswer: '1/8', alternativeAnswers: ['0.125'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'You are sharing half of something among $4$ people.' },
      { level: 'guide', text: 'Cutting $\\frac{1}{2}$ into $4$ equal pieces makes the pieces $4$ times smaller.' },
      { level: 'reveal', text: '$\\frac{1}{2} \\div 4 = \\frac{1}{8}$.' },
    ],
    explanation: [
      'Sharing $\\frac{1}{2}$ among $4$: each share is $\\frac{1}{2} \\times \\frac{1}{4}$.',
      '$\\frac{1}{2} \\times \\frac{1}{4} = \\frac{1}{8}$.',
    ],
    alternativeExplanations: [
      { title: 'Picture it', steps: ['Half a pizza shared by 4 friends.', 'The whole pizza would give each person $\\frac{1}{8}$ × 2 = wait — half gives each $\\frac{1}{8}$ of the whole pizza.'] },
    ],
    tags: ['fractions', 'division'], estimatedSeconds: 50,
  },
  {
    domain: '5.F', num: 26, unit: 3, order: 6, slug: 'fraction-of-amount',
    standard: '5.NF.B.4', difficulty: 2,
    prompt: 'A class has $40$ students. $\\frac{3}{5}$ of them take the bus. How many students take the bus?',
    answerType: 'numeric', primaryAnswer: '24', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '"Of" means multiply: $\\frac{3}{5} \\times 40$.' },
      { level: 'guide', text: 'Find $\\frac{1}{5}$ of $40$ first: $40 \\div 5 = 8$.' },
      { level: 'reveal', text: 'Then $3$ fifths is $3 \\times 8 = 24$.' },
    ],
    explanation: [
      'One fifth of $40$ is $40 \\div 5 = 8$.',
      'Three fifths is $3 \\times 8 = 24$ students.',
    ],
    alternativeExplanations: [
      { title: 'Multiply straight across', steps: ['$\\frac{3}{5} \\times 40 = \\frac{120}{5}$.', '$120 \\div 5 = 24$.'] },
    ],
    tags: ['MAP-practice', 'word-problem', 'fractions'], estimatedSeconds: 55,
  },
  {
    domain: '5.F', num: 27, unit: 3, order: 7, slug: 'frac-area',
    standard: '5.NF.B.4', difficulty: 2,
    prompt: 'A sticker is a rectangle $\\frac{2}{3}$ inch by $\\frac{3}{2}$ inches. What is its area in square inches?',
    answerType: 'numeric', primaryAnswer: '1', alternativeAnswers: ['6/6', '1.0'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Area of a rectangle = length × width, even with fractions.' },
      { level: 'guide', text: '$\\frac{2}{3} \\times \\frac{3}{2} = \\frac{6}{6}$.' },
      { level: 'reveal', text: '$\\frac{6}{6} = 1$ square inch.' },
    ],
    explanation: [
      'Area $= \\frac{2}{3} \\times \\frac{3}{2}$.',
      'Multiply across: $\\frac{2 \\times 3}{3 \\times 2} = \\frac{6}{6} = 1$.',
      'The fractions are reciprocals, so the product is exactly $1$ square inch.',
    ],
    tags: ['fractions', 'area'], estimatedSeconds: 55,
  },
  {
    domain: '5.F', num: 28, unit: 3, order: 8, slug: 'recipe-batches',
    standard: '5.NF.B.4', difficulty: 3,
    prompt: 'One batch of muffins uses $\\frac{3}{4}$ cup of flour. How much flour do $5$ batches need? (mixed number)',
    answerType: 'fraction', primaryAnswer: '3 3/4', alternativeAnswers: ['15/4', '3.75'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Five copies of $\\frac{3}{4}$ — that is multiplication.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Two batches would take $\\frac{3}{4} + \\frac{3}{4} = \\frac{6}{4} = 1\\frac{1}{2}$ cups. Same idea for 5.' },
      { level: 'guide', text: '$5 \\times \\frac{3}{4} = \\frac{15}{4}$.' },
      { level: 'reveal', text: '$\\frac{15}{4} = 3\\frac{3}{4}$ cups.' },
    ],
    explanation: [
      '$5 \\times \\frac{3}{4} = \\frac{5 \\times 3}{4} = \\frac{15}{4}$.',
      '$15 \\div 4 = 3$ remainder $3$, so $\\frac{15}{4} = 3\\frac{3}{4}$.',
      'Five batches need $3\\frac{3}{4}$ cups of flour.',
    ],
    alternativeExplanations: [
      { title: 'Decimal check', steps: ['$\\frac{3}{4} = 0.75$.', '$5 \\times 0.75 = 3.75 = 3\\frac{3}{4}$ ✓'] },
    ],
    tags: ['MAP-practice', 'word-problem', 'fractions'], estimatedSeconds: 90,
  },
  {
    domain: '5.F', num: 29, unit: 3, order: 9, slug: 'ribbon-pieces',
    standard: '5.NF.B.7', difficulty: 3,
    prompt: 'A ribbon is $6$ feet long. It is cut into pieces that are each $\\frac{3}{4}$ foot long. How many pieces are there?',
    answerType: 'numeric', primaryAnswer: '8', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'This asks: how many $\\frac{3}{4}$-foot pieces fit in $6$ feet?' },
      { level: 'nudge', title: '🔁 Another angle', text: 'Every $3$ feet gives $4$ pieces (since $4 \\times \\frac{3}{4} = 3$). How many 3-foot chunks are in 6 feet?' },
      { level: 'guide', text: 'Compute $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3}$.' },
      { level: 'reveal', text: '$6 \\times \\frac{4}{3} = \\frac{24}{3} = 8$ pieces.' },
    ],
    explanation: [
      'Pieces $= 6 \\div \\frac{3}{4}$.',
      'Keep-change-flip: $6 \\times \\frac{4}{3} = \\frac{24}{3} = 8$.',
      'Check: $8 \\times \\frac{3}{4} = 6$ feet ✓.',
    ],
    alternativeExplanations: [
      { title: 'Count by chunks', steps: ['$4$ pieces use $3$ feet of ribbon.', '$6$ feet is two of those chunks: $2 \\times 4 = 8$ pieces.'] },
    ],
    tags: ['MAP-practice', 'word-problem', 'division'], estimatedSeconds: 95,
  },
  {
    domain: '5.F', num: 30, unit: 3, order: 10, slug: 'scaling-mc',
    standard: '5.NF.B.5', difficulty: 2,
    prompt: 'Without multiplying, which product is **greater than** $\\frac{5}{6}$?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '5/6 × 7/8', correct: false },
      { id: 'B', label: '5/6 × 1', correct: false },
      { id: 'C', label: '5/6 × 9/8', correct: true },
      { id: 'D', label: '5/6 × 3/4', correct: false },
    ],
    primaryAnswer: 'C', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Multiplying by a number bigger than 1 makes things bigger; smaller than 1 makes them smaller.' },
      { level: 'guide', text: 'Which factor is greater than $1$? Only $\\frac{9}{8}$.' },
      { level: 'reveal', text: '$\\frac{5}{6} \\times \\frac{9}{8} > \\frac{5}{6}$ because $\\frac{9}{8} > 1$. Choose C.' },
    ],
    explanation: [
      'Multiplying by a factor greater than $1$ scales a number **up**; by a factor less than $1$ scales it **down**.',
      '$\\frac{7}{8}$, $\\frac{3}{4}$ are less than $1$ (products shrink); $\\times 1$ keeps it equal.',
      '$\\frac{9}{8} > 1$, so $\\frac{5}{6} \\times \\frac{9}{8}$ is the only product bigger than $\\frac{5}{6}$.',
    ],
    tags: ['MAP-practice', 'scaling', 'fractions'], estimatedSeconds: 60,
  },

  // ============ UNIT 4 — Decimals: place value & operations ============
  {
    domain: '5.F', num: 31, unit: 4, order: 1, slug: 'decimal-to-fraction',
    standard: '5.NBT.A.3', difficulty: 1,
    prompt: 'Write $0.6$ as a fraction in simplest form.',
    answerType: 'fraction', primaryAnswer: '3/5', alternativeAnswers: ['6/10', '0.6'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$0.6$ means $6$ tenths.' },
      { level: 'guide', text: '$\\frac{6}{10}$ — divide top and bottom by $2$.' },
      { level: 'reveal', text: '$\\frac{6}{10} = \\frac{3}{5}$.' },
    ],
    explanation: [
      '$0.6 = \\frac{6}{10}$ (six tenths).',
      'Simplify by dividing both by $2$: $\\frac{3}{5}$.',
    ],
    tags: ['decimals', 'fractions'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 32, unit: 4, order: 2, slug: 'compare-decimals-mc',
    standard: '5.NBT.A.3', difficulty: 1,
    prompt: 'Which number is **greater**?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '0.45', correct: false },
      { id: 'B', label: '0.5', correct: true },
      { id: 'C', label: 'They are equal', correct: false },
      { id: 'D', label: 'Impossible to tell', correct: false },
    ],
    primaryAnswer: 'B', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Give both numbers the same number of decimal places.' },
      { level: 'guide', text: '$0.5 = 0.50$. Now compare $0.45$ and $0.50$.' },
      { level: 'reveal', text: '$0.50 > 0.45$, so $0.5$ is greater — choose B.' },
    ],
    explanation: [
      'Write both as hundredths: $0.45$ and $0.50$.',
      '$50$ hundredths is more than $45$ hundredths.',
      'So $0.5 > 0.45$.',
    ],
    alternativeExplanations: [
      { title: 'Money picture', steps: ['$0.45$ is 45 cents; $0.5$ is 50 cents.', '50 cents is more.'] },
    ],
    tags: ['MAP-practice', 'decimals', 'comparing'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 33, unit: 4, order: 3, slug: 'round-tenths',
    standard: '5.NBT.A.4', difficulty: 1,
    prompt: 'Round $3.86$ to the nearest tenth.',
    answerType: 'numeric', primaryAnswer: '3.9', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The tenths digit is $8$; look at the digit after it.' },
      { level: 'guide', text: 'The hundredths digit is $6$, which is $5$ or more — round up.' },
      { level: 'reveal', text: '$3.86 \\to 3.9$.' },
    ],
    explanation: [
      '$3.86$ sits between $3.8$ and $3.9$.',
      'The hundredths digit is $6 \\ge 5$, so round the tenths up.',
      '$3.86 \\approx 3.9$.',
    ],
    tags: ['decimals', 'rounding'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 34, unit: 4, order: 4, slug: 'add-decimals',
    standard: '5.NBT.B.7', difficulty: 2,
    prompt: 'Add: $2.5 + 1.75$',
    answerType: 'numeric', primaryAnswer: '4.25', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Line up the decimal points. $2.5$ is the same as $2.50$.' },
      { level: 'guide', text: '$2.50 + 1.75$ — add hundredths, tenths, then ones.' },
      { level: 'reveal', text: '$2.50 + 1.75 = 4.25$.' },
    ],
    explanation: [
      'Write $2.5$ as $2.50$ so both have hundredths.',
      '$2.50 + 1.75 = 4.25$.',
    ],
    alternativeExplanations: [
      { title: 'Money picture', steps: ['$\\$2.50 + \\$1.75$: $2.50 + 1.50 = 4.00$, plus $0.25$ more.', '$= \\$4.25$.'] },
    ],
    tags: ['decimals', 'addition'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 35, unit: 4, order: 5, slug: 'subtract-decimals',
    standard: '5.NBT.B.7', difficulty: 2,
    prompt: 'Subtract: $5 - 2.36$',
    answerType: 'numeric', primaryAnswer: '2.64', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Write $5$ as $5.00$ first.' },
      { level: 'guide', text: 'Count up from $2.36$: $+0.64$ reaches $3$, then $+2$ reaches $5$.' },
      { level: 'reveal', text: '$0.64 + 2 = 2.64$.' },
    ],
    explanation: [
      'Write the problem as $5.00 - 2.36$.',
      'Count up: $2.36 + 0.64 = 3.00$, and $3.00 + 2.00 = 5.00$.',
      'Total counted: $2.64$.',
    ],
    tags: ['decimals', 'subtraction'], estimatedSeconds: 55,
  },
  {
    domain: '5.F', num: 36, unit: 4, order: 6, slug: 'multiply-tenths',
    standard: '5.NBT.B.7', difficulty: 2,
    prompt: 'Multiply: $0.4 \\times 0.6$',
    answerType: 'numeric', primaryAnswer: '0.24', alternativeAnswers: ['.24', '24/100'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Multiply $4 \\times 6$ first, then place the decimal point.' },
      { level: 'guide', text: 'Tenths × tenths = hundredths: two decimal places in the answer.' },
      { level: 'reveal', text: '$4 \\times 6 = 24 \\to 0.24$.' },
    ],
    explanation: [
      '$4 \\times 6 = 24$.',
      'Each factor has one decimal place, so the product has two: $0.24$.',
    ],
    alternativeExplanations: [
      { title: 'Fraction check', steps: ['$\\frac{4}{10} \\times \\frac{6}{10} = \\frac{24}{100}$.', '$= 0.24$ ✓'] },
    ],
    tags: ['decimals', 'multiplication'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 37, unit: 4, order: 7, slug: 'decimal-times-whole',
    standard: '5.NBT.B.7', difficulty: 2,
    prompt: 'Multiply: $1.2 \\times 5$',
    answerType: 'numeric', primaryAnswer: '6', alternativeAnswers: ['6.0'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Split $1.2$ into $1 + 0.2$.' },
      { level: 'guide', text: '$1 \\times 5 = 5$ and $0.2 \\times 5 = 1$.' },
      { level: 'reveal', text: '$5 + 1 = 6$.' },
    ],
    explanation: [
      '$1.2 \\times 5 = (1 + 0.2) \\times 5$.',
      '$1 \\times 5 = 5$ and $0.2 \\times 5 = 1.0$.',
      '$5 + 1 = 6$.',
    ],
    tags: ['decimals', 'multiplication'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 38, unit: 4, order: 8, slug: 'divide-decimals',
    standard: '5.NBT.B.7', difficulty: 2,
    prompt: 'Divide: $3.6 \\div 0.9$',
    answerType: 'numeric', primaryAnswer: '4', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'How many $0.9$s fit into $3.6$?' },
      { level: 'guide', text: 'Multiply both numbers by $10$: $36 \\div 9$.' },
      { level: 'reveal', text: '$36 \\div 9 = 4$.' },
    ],
    explanation: [
      'Shift both numbers one decimal place: $3.6 \\div 0.9 = 36 \\div 9$.',
      '$36 \\div 9 = 4$.',
      'Check: $4 \\times 0.9 = 3.6$ ✓.',
    ],
    tags: ['decimals', 'division'], estimatedSeconds: 50,
  },
  {
    domain: '5.F', num: 39, unit: 4, order: 9, slug: 'smoothie-change',
    standard: '5.NBT.B.7', difficulty: 3,
    prompt: 'Three smoothies cost $\\$4.75$ each. Nia pays with a $\\$20$ bill. How much change does she get?',
    answerType: 'numeric', primaryAnswer: '5.75', alternativeAnswers: ['$5.75'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Two steps: total cost first, then the change from $\\$20$.' },
      { level: 'nudge', title: '🔁 Another angle', text: 'Each smoothie is a quarter less than $\\$5$. Three of them: $\\$15$ minus three quarters.' },
      { level: 'guide', text: 'Total: $3 \\times 4.75 = 14.25$.' },
      { level: 'reveal', text: '$20.00 - 14.25 = 5.75$.' },
    ],
    explanation: [
      'Cost: $3 \\times \\$4.75$.',
      '$3 \\times 4 = 12$ and $3 \\times 0.75 = 2.25$, so the total is $\\$14.25$.',
      'Change: $\\$20.00 - \\$14.25 = \\$5.75$.',
    ],
    alternativeExplanations: [
      { title: 'Friendly-number shortcut', steps: ['$3 \\times \\$5 = \\$15$, but that overcounts $3 \\times \\$0.25 = \\$0.75$.', 'Cost $= 15 - 0.75 = \\$14.25$; change $= \\$5.75$.'] },
    ],
    tags: ['MAP-practice', 'money', 'multi-step'], estimatedSeconds: 100,
  },
  {
    domain: '5.F', num: 40, unit: 4, order: 10, slug: 'quarter-of-decimal',
    standard: '5.NBT.B.7', difficulty: 3,
    prompt: 'Multiply: $0.25 \\times 3.2$',
    answerType: 'numeric', primaryAnswer: '0.8', alternativeAnswers: ['.8', '0.80', '4/5'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$0.25$ is a familiar fraction in disguise.' },
      { level: 'nudge', title: '🔁 Another angle', text: '$0.25 = \\frac{1}{4}$, so this is the same as $3.2 \\div 4$.' },
      { level: 'guide', text: '$3.2 \\div 4$: think $32 \\div 4 = 8$, then place the decimal.' },
      { level: 'reveal', text: '$3.2 \\div 4 = 0.8$.' },
    ],
    explanation: [
      '$0.25 = \\frac{1}{4}$, so $0.25 \\times 3.2$ is one quarter of $3.2$.',
      '$3.2 \\div 4 = 0.8$.',
      'Check by counting decimal places: $25 \\times 32 = 800$; three decimal places → $0.800 = 0.8$ ✓.',
    ],
    alternativeExplanations: [
      { title: 'Money picture', steps: ['A quarter (\\$0.25) of \\$3.20 is like splitting \\$3.20 among 4 people.', 'Each gets \\$0.80.'] },
    ],
    tags: ['MAP-practice', 'decimals'], estimatedSeconds: 80,
  },

  // ============ UNIT 5 — Measurement, conversions & volume ============
  {
    domain: '5.F', num: 41, unit: 5, order: 1, slug: 'm-to-cm',
    standard: '5.MD.A.1', difficulty: 1,
    prompt: 'Convert: $3$ meters $=$ ? centimeters',
    answerType: 'numeric', primaryAnswer: '300', alternativeAnswers: ['300 cm'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$1$ meter $= 100$ centimeters.' },
      { level: 'guide', text: 'Multiply the meters by $100$.' },
      { level: 'reveal', text: '$3 \\times 100 = 300$ cm.' },
    ],
    explanation: [
      '$1$ m $= 100$ cm.',
      '$3 \\times 100 = 300$ cm.',
    ],
    tags: ['measurement', 'metric'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 42, unit: 5, order: 2, slug: 'in-to-ft',
    standard: '5.MD.A.1', difficulty: 1,
    prompt: 'Convert: $48$ inches $=$ ? feet',
    answerType: 'numeric', primaryAnswer: '4', alternativeAnswers: ['4 ft', '4 feet'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$12$ inches make $1$ foot.' },
      { level: 'guide', text: 'Going from a small unit to a bigger unit means divide.' },
      { level: 'reveal', text: '$48 \\div 12 = 4$ feet.' },
    ],
    explanation: [
      '$12$ in $= 1$ ft.',
      '$48 \\div 12 = 4$ feet.',
    ],
    alternativeExplanations: [
      { title: 'Count up by 12s', steps: ['$12, 24, 36, 48$ — that is 4 jumps.', 'So $48$ in $= 4$ ft.'] },
    ],
    tags: ['measurement', 'customary'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 43, unit: 5, order: 3, slug: 'kg-to-g',
    standard: '5.MD.A.1', difficulty: 2,
    prompt: 'Convert: $2.5$ kilograms $=$ ? grams',
    answerType: 'numeric', primaryAnswer: '2500', alternativeAnswers: ['2,500', '2500 g'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$1$ kg $= 1000$ g.' },
      { level: 'guide', text: 'Multiply by $1000$ — the decimal point moves 3 places right.' },
      { level: 'reveal', text: '$2.5 \\times 1000 = 2500$ g.' },
    ],
    explanation: [
      '$1$ kg $= 1000$ g.',
      '$2.5 \\times 1000 = 2500$ grams.',
    ],
    tags: ['measurement', 'metric'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 44, unit: 5, order: 4, slug: 'hours-to-min',
    standard: '5.MD.A.1', difficulty: 2,
    prompt: 'A movie lasts $3$ hours $15$ minutes. How many **minutes** is that?',
    answerType: 'numeric', primaryAnswer: '195', alternativeAnswers: ['195 min'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Convert the hours first; then add the leftover minutes.' },
      { level: 'guide', text: '$3 \\times 60 = 180$ minutes.' },
      { level: 'reveal', text: '$180 + 15 = 195$ minutes.' },
    ],
    explanation: [
      '$1$ hour $= 60$ minutes, so $3$ hours $= 180$ minutes.',
      'Add the extra $15$: $180 + 15 = 195$ minutes.',
    ],
    tags: ['MAP-practice', 'measurement', 'time'], estimatedSeconds: 45,
  },
  {
    domain: '5.F', num: 45, unit: 5, order: 5, slug: 'volume-4-3-2',
    standard: '5.MD.C.5', difficulty: 2,
    prompt: 'What is the **volume** of this box, in cubic centimeters?',
    diagram: labeledPrism('4 cm', '3 cm', '2 cm', 'A box labeled 4 cm long, 3 cm wide, 2 cm tall'),
    answerType: 'numeric', primaryAnswer: '24', alternativeAnswers: ['24 cm3', '24 cubic cm'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Volume of a box $=$ length × width × height.' },
      { level: 'guide', text: '$4 \\times 3 \\times 2$.' },
      { level: 'reveal', text: '$4 \\times 3 = 12$, then $12 \\times 2 = 24$ cubic cm.' },
    ],
    explanation: [
      '$V = l \\times w \\times h = 4 \\times 3 \\times 2$.',
      '$4 \\times 3 = 12$ and $12 \\times 2 = 24$.',
      'The volume is $24$ cubic centimeters.',
    ],
    alternativeExplanations: [
      { title: 'Layer counting', steps: ['One layer of unit cubes is $4 \\times 3 = 12$ cubes.', 'There are $2$ layers: $12 \\times 2 = 24$ cubes.'] },
    ],
    tags: ['MAP-practice', 'volume'], estimatedSeconds: 55,
  },
  {
    domain: '5.F', num: 46, unit: 5, order: 6, slug: 'cube-volume',
    standard: '5.MD.C.5', difficulty: 2,
    prompt: 'A cube has edges $5$ inches long. What is its volume in cubic inches?',
    answerType: 'numeric', primaryAnswer: '125', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'All three edges of a cube are equal.' },
      { level: 'guide', text: '$5 \\times 5 \\times 5$.' },
      { level: 'reveal', text: '$25 \\times 5 = 125$ cubic inches.' },
    ],
    explanation: [
      '$V = 5 \\times 5 \\times 5$.',
      '$5 \\times 5 = 25$, then $25 \\times 5 = 125$.',
    ],
    tags: ['volume'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 47, unit: 5, order: 7, slug: 'gal-to-qt',
    standard: '5.MD.A.1', difficulty: 2,
    prompt: 'Convert: $3$ gallons $=$ ? quarts',
    answerType: 'numeric', primaryAnswer: '12', alternativeAnswers: ['12 qt', '12 quarts'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$1$ gallon $= 4$ quarts.' },
      { level: 'guide', text: 'Bigger unit to smaller unit → multiply.' },
      { level: 'reveal', text: '$3 \\times 4 = 12$ quarts.' },
    ],
    explanation: [
      '$1$ gal $= 4$ qt.',
      '$3 \\times 4 = 12$ quarts.',
    ],
    tags: ['measurement', 'customary'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 48, unit: 5, order: 8, slug: 'fish-tank-volume',
    standard: '5.MD.C.5', difficulty: 3,
    prompt: 'A fish tank is $60$ cm long, $30$ cm wide, and $40$ cm tall. What is its volume in cubic centimeters?',
    diagram: labeledPrism('60 cm', '30 cm', '40 cm', 'A tank labeled 60 cm by 30 cm by 40 cm'),
    answerType: 'numeric', primaryAnswer: '72000', alternativeAnswers: ['72,000'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Same box formula, just bigger numbers: $l \\times w \\times h$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'A $6 \\times 3 \\times 4$ box has volume $72$. Your tank is $10\\times$ bigger in every direction.' },
      { level: 'guide', text: '$60 \\times 30 = 1800$. Then multiply by $40$.' },
      { level: 'reveal', text: '$1800 \\times 40 = 72{,}000$ cubic cm.' },
    ],
    explanation: [
      '$V = 60 \\times 30 \\times 40$.',
      '$60 \\times 30 = 1800$.',
      '$1800 \\times 40 = 72{,}000$ cubic centimeters.',
    ],
    alternativeExplanations: [
      { title: 'Scale up a small box', steps: ['$6 \\times 3 \\times 4 = 72$.', 'Each edge is $10\\times$ longer, so the volume is $10 \\times 10 \\times 10 = 1000\\times$ bigger: $72 \\times 1000 = 72{,}000$.'] },
    ],
    tags: ['MAP-practice', 'volume', 'multi-step'], estimatedSeconds: 100,
  },
  {
    domain: '5.F', num: 49, unit: 5, order: 9, slug: 'composite-volume',
    standard: '5.MD.C.5', difficulty: 3,
    prompt: 'A step is built from two boxes glued together: one is $5 \\times 4 \\times 3$ and the other is $5 \\times 4 \\times 2$. What is the **total volume**?',
    answerType: 'numeric', primaryAnswer: '100', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Find each box volume separately, then add.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Two boxes of volume $10$ and $20$ together hold $30$. Same plan here.' },
      { level: 'guide', text: 'Box 1: $5 \\times 4 \\times 3 = 60$. Box 2: $5 \\times 4 \\times 2 = ?$' },
      { level: 'reveal', text: 'Box 2 is $40$. Total: $60 + 40 = 100$.' },
    ],
    explanation: [
      'Box 1: $5 \\times 4 \\times 3 = 60$ cubic units.',
      'Box 2: $5 \\times 4 \\times 2 = 40$ cubic units.',
      'Total volume: $60 + 40 = 100$ cubic units.',
    ],
    alternativeExplanations: [
      { title: 'Combine first', steps: ['Both boxes share a $5 \\times 4$ base.', 'Stack the heights: $3 + 2 = 5$, so $V = 5 \\times 4 \\times 5 = 100$.'] },
    ],
    tags: ['MAP-practice', 'volume', 'composite'], estimatedSeconds: 95,
  },
  {
    domain: '5.F', num: 50, unit: 5, order: 10, slug: 'best-unit-mc',
    standard: '5.MD.A.1', difficulty: 2,
    prompt: 'Which unit is **best** for measuring the mass of an apple?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'kilometers', correct: false },
      { id: 'B', label: 'grams', correct: true },
      { id: 'C', label: 'liters', correct: false },
      { id: 'D', label: 'hours', correct: false },
    ],
    primaryAnswer: 'B', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Mass means how much matter — which units measure mass?' },
      { level: 'guide', text: 'Kilometers measure distance, liters measure liquid, hours measure time.' },
      { level: 'reveal', text: 'Grams measure mass — an apple is about $150$–$250$ g. Choose B.' },
    ],
    explanation: [
      'Mass is measured in grams or kilograms.',
      'An apple has a small mass, so grams fit best (about $200$ g).',
    ],
    tags: ['measurement', 'units'], estimatedSeconds: 30,
  },

  // ============ UNIT 6 — Coordinate plane, patterns & line plots ============
  {
    domain: '5.F', num: 51, unit: 6, order: 1, slug: 'plot-from-directions',
    standard: '5.G.A.1', difficulty: 1,
    prompt: 'Start at the origin $(0,0)$. Move $3$ right and $4$ up. What are the coordinates of where you land? Write it like $(x,y)$.',
    answerType: 'short-text', primaryAnswer: '(3,4)', alternativeAnswers: ['(3, 4)', '3,4'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The first number is the sideways move; the second is the up move.' },
      { level: 'guide', text: 'Right $3$ → $x = 3$. Up $4$ → $y = 4$.' },
      { level: 'reveal', text: 'The point is $(3, 4)$.' },
    ],
    explanation: [
      'Coordinates are written $(x, y)$: across first, then up.',
      'Right $3$ makes $x=3$; up $4$ makes $y=4$.',
      'So you land on $(3, 4)$.',
    ],
    tags: ['coordinate-plane'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 52, unit: 6, order: 2, slug: 'read-plotted-point',
    standard: '5.G.A.1', difficulty: 1,
    prompt: 'What are the coordinates of the point shown? Write it like $(x,y)$.',
    diagram: coordPlane([[2, 5]], 6, 'A grid with one red point plotted at 2 across and 5 up'),
    answerType: 'short-text', primaryAnswer: '(2,5)', alternativeAnswers: ['(2, 5)', '2,5'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Count across from the corner first, then count up.' },
      { level: 'guide', text: 'The point is $2$ across and $5$ up.' },
      { level: 'reveal', text: '$(2, 5)$.' },
    ],
    explanation: [
      'From the origin, the point is $2$ units across — that is the $x$-coordinate.',
      'It is $5$ units up — that is the $y$-coordinate.',
      'So the point is $(2, 5)$.',
    ],
    tags: ['MAP-practice', 'coordinate-plane'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 53, unit: 6, order: 3, slug: 'which-axis-first-mc',
    standard: '5.G.A.1', difficulty: 2,
    prompt: 'In the ordered pair $(7, 2)$, the first number tells you how far to travel along the…',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'x-axis (left–right)', correct: true },
      { id: 'B', label: 'y-axis (up–down)', correct: false },
      { id: 'C', label: 'diagonal', correct: false },
      { id: 'D', label: 'It depends on the graph', correct: false },
    ],
    primaryAnswer: 'A', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Ordered pairs always follow the same order.' },
      { level: 'guide', text: 'Think: "run before you jump" — across before up.' },
      { level: 'reveal', text: 'The first number is the x-coordinate (left–right). Choose A.' },
    ],
    explanation: [
      'An ordered pair is $(x, y)$.',
      'The $x$-coordinate always comes first and measures left–right distance along the x-axis.',
    ],
    tags: ['coordinate-plane'], estimatedSeconds: 30,
  },
  {
    domain: '5.F', num: 54, unit: 6, order: 4, slug: 'horizontal-distance',
    standard: '5.G.A.2', difficulty: 2,
    prompt: 'How far apart are the points $(1, 2)$ and $(6, 2)$?',
    answerType: 'numeric', primaryAnswer: '5', alternativeAnswers: ['5 units'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The y-coordinates match, so the points sit on the same horizontal line.' },
      { level: 'guide', text: 'Subtract the x-coordinates.' },
      { level: 'reveal', text: '$6 - 1 = 5$ units.' },
    ],
    explanation: [
      'Both points have $y = 2$, so the distance is purely horizontal.',
      'Distance $= 6 - 1 = 5$ units.',
    ],
    tags: ['coordinate-plane', 'distance'], estimatedSeconds: 40,
  },
  {
    domain: '5.F', num: 55, unit: 6, order: 5, slug: 'pattern-8th-term',
    standard: '5.OA.B.3', difficulty: 2,
    prompt: 'A pattern starts at $0$ and adds $3$ each time: $0, 3, 6, 9, \\ldots$ What is the **8th** term?',
    answerType: 'numeric', primaryAnswer: '21', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Term 1 is $0$. How many “+3 jumps” happen by term 8?' },
      { level: 'guide', text: 'From term 1 to term 8 is $7$ jumps of $3$.' },
      { level: 'reveal', text: '$0 + 7 \\times 3 = 21$.' },
    ],
    explanation: [
      'The terms are $0, 3, 6, 9, 12, 15, 18, 21$.',
      'Term 8 comes after $7$ jumps of $+3$: $0 + 21 = 21$.',
    ],
    alternativeExplanations: [
      { title: 'Just list them', steps: ['1st 0, 2nd 3, 3rd 6, 4th 9, 5th 12, 6th 15, 7th 18, 8th 21.'] },
    ],
    tags: ['MAP-practice', 'patterns'], estimatedSeconds: 50,
  },
  {
    domain: '5.F', num: 56, unit: 6, order: 6, slug: 'two-patterns-relate',
    standard: '5.OA.B.3', difficulty: 2,
    prompt: 'Pattern A starts at $0$ and adds $2$: $0,2,4,6,\\ldots$ Pattern B starts at $0$ and adds $6$: $0,6,12,18,\\ldots$ Each B term is how many **times** the matching A term?',
    answerType: 'numeric', primaryAnswer: '3', alternativeAnswers: ['3 times', 'x3'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Line the patterns up term by term and compare.' },
      { level: 'guide', text: 'When A is $2$, B is $6$. When A is $4$, B is $12$.' },
      { level: 'reveal', text: '$6 \\div 2 = 3$ and $12 \\div 4 = 3$ — each B term is $3\\times$ the A term.' },
    ],
    explanation: [
      'Match the terms: A $= 2, 4, 6$ while B $= 6, 12, 18$.',
      'Each B term divided by its A term gives $3$.',
      'That happens because B adds $6$, which is $3$ times the $2$ that A adds.',
    ],
    tags: ['patterns', 'relationships'], estimatedSeconds: 60,
  },
  {
    domain: '5.F', num: 57, unit: 6, order: 7, slug: 'line-plot-read',
    standard: '5.MD.B.2', difficulty: 2,
    prompt: 'The line plot shows ribbon lengths in feet. How many ribbons measured $\\frac{1}{2}$ foot?',
    diagram: linePlot([
      { pos: 0.1, n: 2, lab: '1/4' },
      { pos: 0.5, n: 3, lab: '1/2' },
      { pos: 0.9, n: 1, lab: '3/4' },
    ], 'Line plot with 2 Xs above 1/4, 3 Xs above 1/2, and 1 X above 3/4'),
    answerType: 'numeric', primaryAnswer: '3', alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Each X is one ribbon.' },
      { level: 'guide', text: 'Count the Xs stacked above the $\\frac{1}{2}$ mark.' },
      { level: 'reveal', text: 'There are $3$ Xs above $\\frac{1}{2}$.' },
    ],
    explanation: [
      'On a line plot, each X is one data point.',
      'Above $\\frac{1}{2}$ there are $3$ Xs, so $3$ ribbons measured $\\frac{1}{2}$ foot.',
    ],
    tags: ['line-plot', 'data'], estimatedSeconds: 35,
  },
  {
    domain: '5.F', num: 58, unit: 6, order: 8, slug: 'line-plot-total',
    standard: '5.MD.B.2', difficulty: 3,
    prompt: 'Using the same line plot ($2$ ribbons of $\\frac{1}{4}$ ft, $3$ of $\\frac{1}{2}$ ft, $1$ of $\\frac{3}{4}$ ft): what is the **total** length of all the ribbons, in feet?',
    diagram: linePlot([
      { pos: 0.1, n: 2, lab: '1/4' },
      { pos: 0.5, n: 3, lab: '1/2' },
      { pos: 0.9, n: 1, lab: '3/4' },
    ], 'Line plot with 2 Xs above 1/4, 3 Xs above 1/2, and 1 X above 3/4'),
    answerType: 'numeric', primaryAnswer: '2.75', alternativeAnswers: ['2 3/4', '11/4'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Multiply each length by how many ribbons have it, then add everything.' },
      { level: 'nudge', title: '🔁 Another angle', text: 'Work in quarters: $\\frac{1}{4}$ is 1 quarter, $\\frac{1}{2}$ is 2 quarters, $\\frac{3}{4}$ is 3 quarters.' },
      { level: 'guide', text: '$2 \\times \\frac{1}{4} = \\frac{2}{4}$, $3 \\times \\frac{1}{2} = \\frac{3}{2}$, $1 \\times \\frac{3}{4} = \\frac{3}{4}$.' },
      { level: 'reveal', text: 'In quarters: $2 + 6 + 3 = 11$ quarters $= \\frac{11}{4} = 2\\frac{3}{4}$ ft.' },
    ],
    explanation: [
      'Count in quarters of a foot: the $\\frac{1}{4}$-ribbons give $2 \\times 1 = 2$ quarters.',
      'The $\\frac{1}{2}$-ribbons give $3 \\times 2 = 6$ quarters.',
      'The $\\frac{3}{4}$-ribbon gives $3$ quarters.',
      'Total: $2 + 6 + 3 = 11$ quarters $= \\frac{11}{4} = 2\\frac{3}{4} = 2.75$ feet.',
    ],
    alternativeExplanations: [
      { title: 'Decimals', steps: ['$2(0.25) + 3(0.5) + 1(0.75)$.', '$0.5 + 1.5 + 0.75 = 2.75$ ft ✓'] },
    ],
    tags: ['MAP-practice', 'line-plot', 'multi-step'], estimatedSeconds: 110,
  },
  {
    domain: '5.F', num: 59, unit: 6, order: 9, slug: 'translate-point',
    standard: '5.G.A.2', difficulty: 3,
    prompt: 'Point $P$ is at $(4, 1)$. You move it $2$ units right and $3$ units up. Where is $P$ now? Write it like $(x,y)$.',
    answerType: 'short-text', primaryAnswer: '(6,4)', alternativeAnswers: ['(6, 4)', '6,4'],
    acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Right changes $x$; up changes $y$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Moving $(1,1)$ right 2 gives $(3,1)$. Then up 3 gives $(3,4)$. Same moves for $P$.' },
      { level: 'guide', text: '$x: 4 + 2$ and $y: 1 + 3$.' },
      { level: 'reveal', text: 'New point: $(6, 4)$.' },
    ],
    explanation: [
      'Moving right adds to the $x$-coordinate: $4 + 2 = 6$.',
      'Moving up adds to the $y$-coordinate: $1 + 3 = 4$.',
      'So $P$ lands on $(6, 4)$.',
    ],
    tags: ['MAP-practice', 'coordinate-plane'], estimatedSeconds: 60,
  },
  {
    domain: '5.F', num: 60, unit: 6, order: 10, slug: 'on-x-axis-mc',
    standard: '5.G.A.1', difficulty: 2,
    prompt: 'A point sits exactly **on the x-axis**. What must be true about its coordinates?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Its x-coordinate is 0', correct: false },
      { id: 'B', label: 'Its y-coordinate is 0', correct: true },
      { id: 'C', label: 'Both coordinates are 0', correct: false },
      { id: 'D', label: 'Both coordinates are equal', correct: false },
    ],
    primaryAnswer: 'B', alternativeAnswers: [],
    acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'The y-coordinate measures how far UP a point is.' },
      { level: 'guide', text: 'A point on the x-axis is not up or down at all.' },
      { level: 'reveal', text: 'No height means $y = 0$ — choose B.' },
    ],
    explanation: [
      'The $y$-coordinate is the distance above (or below) the x-axis.',
      'On the x-axis that distance is $0$, so every such point looks like $(x, 0)$.',
      'Example: $(5, 0)$ is on the x-axis.',
    ],
    tags: ['coordinate-plane'], estimatedSeconds: 40,
  },
];
