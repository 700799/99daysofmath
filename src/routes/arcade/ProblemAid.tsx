import { AnimatePresence, motion } from 'framer-motion';

// ProblemAid — a "scratch paper" help drawer for a word/number problem. It reads
// the problem text, figures out what KIND it is (unit rate, proportion, fraction
// of a number, area, mean, …) and writes out the steps to solve it with the real
// numbers — plus a little ratio table when that helps. The goal is to model HOW
// to work it out on paper, not to hand over the answer cold.

interface Aid {
  title: string;
  steps: string[];
  table?: { headers: [string, string]; rows: [string, string][] };
}

const nums = (s: string): number[] => (s.match(/\d+/g) ?? []).map(Number);

// Build a step-by-step solving aid from the problem text.
export function buildSolveAid(prompt: string): Aid {
  const n = nums(prompt);
  const p = prompt.toLowerCase().replace(/−/g, '-'); // normalize unicode minus

  // --- Precalculus shapes ---------------------------------------------------
  if (/log base/.test(p)) {
    return {
      title: 'A log asks for the exponent',
      steps: [
        'Read it as a question: the base to WHAT power gives that number?',
        'Multiply the base by itself, counting steps, until you hit the target.',
        'The number of steps IS the logarithm.',
      ],
    };
  }
  if (/amplitude|maximum value/.test(p) && /sin|cos/.test(p)) {
    return {
      title: 'Amplitude, midline, maximum',
      steps: [
        'In y = a·sin(x) + k, the amplitude is a and the midline is k.',
        'Maximum = midline + amplitude; minimum = midline − amplitude.',
        'Amplitude is HALF the peak-to-trough distance.',
      ],
    };
  }
  if (/period/.test(p) && /sin|cos/.test(p)) {
    return { title: 'Period = 360 ÷ b', steps: ['In sin(bx), b counts how many waves fit in one turn.', 'So one wave takes 360° ÷ b.'] };
  }
  if (/hypotenuse|right triangle/.test(p)) {
    return {
      title: 'Right triangle: a² + b² = c²',
      steps: [
        'The hypotenuse c is always across from the right angle (the longest side).',
        'Missing hypotenuse: add the squares of the legs, then square-root.',
        'Missing leg: subtract the known leg squared from c², then square-root.',
      ],
    };
  }
  if (/arithmetic sequence/.test(p)) {
    return { title: 'Term n of an arithmetic list', steps: ['Term n = first + (n − 1) × d.', 'Careful: it is (n − 1) jumps, not n.'] };
  }
  if (/geometric sequence|doubles each time/.test(p)) {
    return { title: 'Term n of a geometric list', steps: ['Term n = first × r^(n − 1).', 'Or just multiply step by step and count the jumps.'] };
  }
  if (/counting numbers/.test(p)) {
    return { title: 'Pair the ends (Gauss)', steps: ['1 + 2 + … + n pairs up: first + last, second + second-last…', 'Sum = n × (n + 1) ÷ 2.'] };
  }
  if (/shifts? (right|left)|shift/.test(p) && /\(x/.test(p)) {
    return { title: 'Inside moves sideways (and lies)', steps: ['A change INSIDE the parentheses moves the graph sideways.', 'Minus moves RIGHT, plus moves LEFT — the opposite of what it looks like.'] };
  }

  // --- Algebra 1 shapes -----------------------------------------------------
  // distribute: "3(x + 2) = 21"
  let m = p.match(/(\d+)\(x \+ (\d+)\) = (\d+)/);
  if (m) {
    const [a, b, c] = [Number(m[1]), Number(m[2]), Number(m[3])];
    return {
      title: 'Unwrap the parentheses',
      steps: [
        `Divide both sides by ${a} first: x + ${b} = ${c} ÷ ${a} = ${c / a}.`,
        `Undo the + ${b}: subtract ${b} from both sides.`,
        `x = ${c / a} − ${b} = ${c / a - b}.`,
      ],
    };
  }
  // variables both sides: "5x + 2 = 2x + 14"
  m = p.match(/(\d+)x \+ (\d+) = (\d+)x \+ (\d+)/);
  if (m) {
    const [a, b, c, d] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
    return {
      title: "Get the x's on one team",
      steps: [
        `Subtract ${c}x from both sides: ${a - c}x + ${b} = ${d}.`,
        `Subtract ${b}: ${a - c}x = ${d - b}.`,
        `Divide by ${a - c}: x = ${(d - b) / (a - c)}.`,
      ],
    };
  }
  // two-step: "3x + 4 = 19" or "3x - 4 = 11"
  m = p.match(/(\d+)x ([+-]) (\d+) = (\d+)/);
  if (m) {
    const [a, op, b, c] = [Number(m[1]), m[2], Number(m[3]), Number(m[4])];
    const afterUndo = op === '+' ? c - b : c + b;
    return {
      title: 'Undo in reverse: ± first, then ÷',
      steps: [
        `${op === '+' ? `Subtract ${b} from` : `Add ${b} to`} both sides: ${a}x = ${afterUndo}.`,
        `Divide both sides by ${a}.`,
        `x = ${afterUndo} ÷ ${a} = ${afterUndo / a}.`,
      ],
    };
  }
  // one-step: "3x = 21" / "x + 5 = 12"
  m = p.match(/(\d+)x = (\d+)/);
  if (m && /solve/.test(p)) {
    const [a, c] = [Number(m[1]), Number(m[2])];
    return { title: 'Divide both sides', steps: [`${a}x means ${a} × x.`, `Divide both sides by ${a}: x = ${c} ÷ ${a} = ${c / a}.`] };
  }
  m = p.match(/x \+ (\d+) = (\d+)/);
  if (m) {
    const [a, c] = [Number(m[1]), Number(m[2])];
    return { title: 'Subtract from both sides', steps: [`Undo the + ${a}: subtract ${a} from both sides.`, `x = ${c} − ${a} = ${c - a}.`] };
  }
  // evaluate a line or function: "If y = 3x + 4 ... x = 5" / "f(x) = 4x - 3. Find f(6)."
  if (/what is y when x|find f\(/.test(p)) {
    return {
      title: 'Substitute, then compute',
      steps: [
        'Swap the x for the given number (wrap it in parentheses).',
        'Multiply first — a number next to x means TIMES.',
        'Then add or subtract what is left.',
      ],
    };
  }
  // slope through two points
  if (/slope through/.test(p)) {
    return {
      title: 'Slope = rise over run',
      steps: [
        'Rise: second y minus first y.',
        'Run: second x minus first x (SAME order!).',
        'Slope = rise ÷ run.',
      ],
    };
  }
  // start fee + rate: "costs $3 to start plus $2 per hour ... for 4 hours"
  if (/to start plus/.test(p) && /per hour/.test(p)) {
    const [fee, per, h] = n;
    return {
      title: 'Start amount + rate × time',
      steps: [
        `The start fee happens once: $${fee}.`,
        `The hourly part grows: $${per} × ${h} = $${per * h}.`,
        `Total: ${fee} + ${per * h} = $${fee + per * h}.`,
      ],
    };
  }

  // unit rate: "3 pens cost $18. How much for 6 pens?"
  if (/cost \$\d+/.test(p) && /how much for/.test(p)) {
    const [q1, total, q2] = n;
    const per = total / q1;
    return {
      title: 'Unit rate, then scale up',
      steps: [
        `Find the cost of ONE: $${total} ÷ ${q1} = $${per} each.`,
        `Multiply by how many you need: $${per} × ${q2} = $${per * q2}.`,
        `Answer: ${q2} cost $${per * q2}.`,
      ],
      table: { headers: ['count', 'cost'], rows: [['1', `$${per}`], [`${q2}`, `$${per * q2}`]] },
    };
  }

  // recipe scale: "uses C cups for B cakes. How many cups for B2 cakes?"
  if (/cups for/.test(p) && /recipe/.test(p)) {
    const [cups, batch, big] = n;
    const times = big / batch;
    return {
      title: 'Find the scale factor',
      steps: [
        `How many times bigger? ${big} ÷ ${batch} = ${times}×.`,
        `Scale the cups the same: ${cups} × ${times} = ${cups * times}.`,
        `Answer: ${cups * times} cups.`,
      ],
      table: { headers: ['cakes', 'cups'], rows: [[`${batch}`, `${cups}`], [`${big}`, `${cups * times}`]] },
    };
  }

  // proportion: "Solve the proportion: a/b = ?/c"
  if (/proportion/.test(p)) {
    const [a, b, c] = n;
    const k = c / b;
    return {
      title: 'Scale both parts equally',
      steps: [
        `How did the bottom grow? ${c} ÷ ${b} = ${k}×.`,
        `Do the same on top: ${a} × ${k} = ${a * k}.`,
        `Answer: ${a * k}.`,
      ],
      table: { headers: ['top', 'bottom'], rows: [[`${a}`, `${b}`], [`${a * k}`, `${c}`]] },
    };
  }

  // equivalent fraction: "num/d = ?/(d*k)"
  if (/equivalent fraction/.test(p)) {
    const [num, d, dk] = n;
    const k = dk / d;
    return {
      title: 'Multiply top and bottom by the same number',
      steps: [
        `Bottom: ${d} × ${k} = ${dk}.`,
        `Top must do the same: ${num} × ${k} = ${num * k}.`,
        `Answer: ${num * k}.`,
      ],
      table: { headers: ['top', 'bottom'], rows: [[`${num}`, `${d}`], [`${num * k}`, `${dk}`]] },
    };
  }

  // fraction of a number: "What is N/D of M?" or "What is 1/D of M?"
  if (/of \d+\??$/.test(p) && /\d+\/\d+|1\//.test(p)) {
    const [a, b, m] = n; // a/b of m
    const part = m / b;
    return {
      title: 'Split into equal parts, then take some',
      steps: [
        `Split ${m} into ${b} equal parts: ${m} ÷ ${b} = ${part}.`,
        a === 1 ? `Take 1 part: ${part}.` : `Take ${a} parts: ${part} × ${a} = ${part * a}.`,
        `Answer: ${part * a}.`,
      ],
    };
  }

  // multiply groups: "A box holds B crayons. How many crayons in N boxes?"
  if (/how many .* in \d+ (boxes|packs|bags|crates)/.test(p)) {
    const [box, count] = n;
    return {
      title: 'Equal groups → multiply',
      steps: [
        `${count} groups of ${box} each.`,
        `${box} × ${count} = ${box * count}.`,
        `Answer: ${box * count}.`,
      ],
    };
  }

  // sharing equally: "X stickers shared equally among G kids"
  if (/shared equally among/.test(p)) {
    const [total, groups] = n;
    return {
      title: 'Sharing equally → divide',
      steps: [
        `Split ${total} into ${groups} equal shares.`,
        `${total} ÷ ${groups} = ${total / groups}.`,
        `Answer: ${total / groups} each.`,
      ],
    };
  }

  // packs plus loose: "A packs of B markers, plus C loose"
  if (/packs of .* plus .* loose/.test(p)) {
    const [a, b, c] = n;
    return {
      title: 'Multiply, then add the extra',
      steps: [
        `Markers in packs: ${a} × ${b} = ${a * b}.`,
        `Add the loose ones: ${a * b} + ${c} = ${a * b + c}.`,
        `Answer: ${a * b + c}.`,
      ],
    };
  }

  // rectangle area
  if (/area/.test(p) && /rectangle/.test(p)) {
    const [w, h] = n;
    return { title: 'Area of a rectangle', steps: [`Area = width × height.`, `${w} × ${h} = ${w * h}.`, `Answer: ${w * h}.`] };
  }
  // rectangle perimeter
  if (/perimeter/.test(p)) {
    const [w, h] = n;
    return { title: 'Perimeter = all four sides', steps: [`Add the sides: ${w} + ${h} + ${w} + ${h}.`, `= 2 × (${w} + ${h}) = ${2 * (w + h)}.`, `Answer: ${2 * (w + h)}.`] };
  }
  // triangle area
  if (/triangle/.test(p) && /area|height/.test(p)) {
    const [b, h] = n;
    return { title: 'Area of a triangle', steps: [`Area = ½ × base × height.`, `½ × ${b} × ${h} = ${(b * h) / 2}.`, `Answer: ${(b * h) / 2}.`] };
  }
  // volume
  if (/volume/.test(p)) {
    const [l, w, h] = n;
    return { title: 'Volume of a box', steps: [`Volume = length × width × height.`, `${l} × ${w} × ${h} = ${l * w * h}.`, `Answer: ${l * w * h}.`] };
  }

  // mean
  if (/mean|average/.test(p)) {
    const sum = n.reduce((a, b) => a + b, 0);
    return { title: 'Mean = total ÷ how many', steps: [`Add them all: ${n.join(' + ')} = ${sum}.`, `Divide by how many (${n.length}): ${sum} ÷ ${n.length} = ${sum / n.length}.`, `Answer: ${sum / n.length}.`] };
  }
  // range
  if (/range/.test(p)) {
    const hi = Math.max(...n), lo = Math.min(...n);
    return { title: 'Range = biggest − smallest', steps: [`Biggest = ${hi}, smallest = ${lo}.`, `${hi} − ${lo} = ${hi - lo}.`, `Answer: ${hi - lo}.`] };
  }
  // median
  if (/median/.test(p)) {
    const s = [...n].sort((a, b) => a - b);
    return { title: 'Median = the middle value', steps: [`Put them in order: ${s.join(', ')}.`, `The middle number is the median.`, `(If two are in the middle, average them.)`] };
  }
  if (/total of/.test(p)) {
    const sum = n.reduce((a, b) => a + b, 0);
    return { title: 'Total = add them all up', steps: [`${n.join(' + ')} = ${sum}.`, `Answer: ${sum}.`] };
  }

  // exponent
  if (/squared/.test(p)) { const b = n[0]; return { title: 'Squared = times itself', steps: [`${b}² means ${b} × ${b}.`, `= ${b * b}.`] }; }
  if (/cubed/.test(p)) { const b = n[0]; return { title: 'Cubed = three times', steps: [`${b}³ means ${b} × ${b} × ${b}.`, `= ${b * b * b}.`] }; }
  if (/to the/.test(p)) { const [b, e] = n; return { title: 'A power = repeated multiply', steps: [`${b} to the ${e} means multiply ${b} by itself ${e} times.`, `= ${Math.pow(b, e)}.`] }; }

  // missing factor
  if (/missing factor/.test(p)) {
    const [a, prod] = n;
    return { title: 'Missing factor → divide', steps: [`${a} × ? = ${prod}.`, `So ? = ${prod} ÷ ${a} = ${prod / a}.`, `Answer: ${prod / a}.`] };
  }
  // divisibility
  if (/divisible by/.test(p)) {
    const [v, k] = n;
    return { title: 'Divisible? Check the remainder', steps: [`Try ${v} ÷ ${k}.`, `If it divides evenly (no remainder) → 1 (yes).`, `Otherwise → 0 (no). Here: ${v % k === 0 ? '1 (yes)' : '0 (no)'}.`] };
  }
  // GCF
  if (/common factor/.test(p)) {
    const [x, y] = n;
    return { title: 'Greatest Common Factor', steps: [`List factors of ${x} and ${y}.`, `Find the BIGGEST number that divides BOTH.`, `Tip: keep dividing both by shared factors.`] };
  }

  // generic 4-step strategy
  return {
    title: 'Solve it step by step',
    steps: [
      'Read it twice — what is it asking for?',
      n.length ? `Circle the numbers: ${n.join(', ')}.` : 'Circle the numbers in the problem.',
      'Decide the operation: groups → ×, sharing → ÷, more → +, less → −.',
      'Work it out on the scratchpad, then estimate to check it makes sense.',
    ],
  };
}

export function ProblemAidDrawer({ prompt, open, onClose }: { prompt: string; open: boolean; onClose: () => void }) {
  const aid = buildSolveAid(prompt);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] max-w-sm overflow-y-auto rounded-t-3xl border-2 border-b-0 border-amber-200 bg-white p-5 pb-8 shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-label="How to solve this problem"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-slate-900">📝 How to solve it</h2>
              <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-display font-bold text-slate-400 hover:text-slate-700">close ✕</button>
            </div>

            {/* the problem, restated */}
            <div className="mt-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-display font-bold text-slate-700">
              {prompt}
            </div>

            <div className="mt-3 font-display text-sm font-extrabold text-amber-700">{aid.title}</div>

            {/* scratch-paper steps */}
            <ol className="mt-2 space-y-2">
              {aid.steps.map((s, i) => (
                <li key={i} className="flex gap-2.5 rounded-xl bg-amber-50/70 px-3 py-2">
                  <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white font-display font-extrabold text-sm">{i + 1}</span>
                  <span className="text-sm font-mono font-bold leading-snug text-slate-800">{s}</span>
                </li>
              ))}
            </ol>

            {/* optional ratio table */}
            {aid.table && (
              <div className="mt-3">
                <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500">Ratio table</div>
                <table className="mt-1 w-full border-collapse text-center font-mono font-bold">
                  <thead>
                    <tr>
                      {aid.table.headers.map((h) => (
                        <th key={h} className="border-2 border-indigo-200 bg-indigo-50 py-1.5 text-sm text-indigo-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aid.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="border-2 border-slate-200 py-1.5 text-sm text-slate-800">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
              ✏️ Use these steps on scratch paper, then type your answer and tap Check.
            </div>

            <button type="button" onClick={onClose} className="mt-4 w-full rounded-2xl bg-amber-500 py-3 font-display font-extrabold text-white active:translate-y-0.5">
              Got it — back to the problem
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
