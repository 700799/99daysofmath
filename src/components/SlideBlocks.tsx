import { useMemo } from 'react';
import katex from 'katex';
import type {
  CompareBlock,
  FormulaBlock,
  SlideArt,
  SlideTone,
  StepsBlock,
  TableBlock,
} from '../data/lessonSlides/types';

/**
 * The visual blocks a lesson slide can carry.
 *
 * A slide used to be a headline and a paragraph, so the rule being taught sat
 * in the middle of a sentence and looked like every other sentence. These lift
 * it out: the formula typeset big in its own frame with each symbol named, two
 * ideas held side by side, a worked run one step per box, a table, a drawing.
 * Every tone resolves to the theme tokens, so all of it follows light and dark.
 */

const TONE: Record<SlideTone, { box: string; label: string; chip: string }> = {
  accent: { box: 'border-accent/40 bg-accent-soft', label: 'text-accent', chip: 'bg-accent text-on-accent' },
  ok: { box: 'border-ok/40 bg-ok-soft', label: 'text-ok', chip: 'bg-ok text-white' },
  warn: { box: 'border-warn/45 bg-warn-soft', label: 'text-warn', chip: 'bg-warn text-white' },
  bad: { box: 'border-bad/45 bg-bad-soft', label: 'text-bad', chip: 'bg-bad text-white' },
  plain: { box: 'border-line bg-surface-2', label: 'text-ink-muted', chip: 'bg-ink-muted text-surface' },
};

function Tex({ tex, display = false, className = '' }: { tex: string; display?: boolean; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'html' }),
    [tex, display],
  );
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** The rule, typeset big in a frame, with each symbol given a job. */
export function FormulaView({ block }: { block: FormulaBlock }) {
  return (
    <div className="mt-3">
      {/* The rule is the point of the slide, so its frame says so: an accent
          wash with a little depth, an eyebrow, and the mathematics set large.
          The wash is the same one every inline equation sits on, just bigger. */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-accent/50 bg-gradient-to-b from-accent-soft to-surface px-3 pb-3 pt-6 shadow-[0_8px_20px_-12px_rgb(var(--accent)/0.55)]">
        <span className="absolute left-3 top-1.5 font-display text-3xs font-extrabold uppercase tracking-[0.14em] text-accent/80">
          Formula
        </span>
        <div
          className="overflow-x-auto text-center text-ink [&_.katex-display]:my-0"
          style={{ fontSize: 'clamp(1.1rem, 5.6vw, 1.55rem)' }}
        >
          <Tex tex={block.tex} display />
        </div>
        {block.note && (
          <p className="mt-2 border-t border-accent/20 pt-2 text-center text-[13px] font-display font-bold leading-snug text-ink-muted">
            {block.note}
          </p>
        )}
      </div>
      {block.parts && block.parts.length > 0 && (
        <div className="mt-2 grid gap-1.5">
          {block.parts.map((p, i) => {
            const t = TONE[p.tone ?? 'plain'];
            return (
              <div key={i} className={`flex items-center gap-2.5 rounded-xl border-2 px-2.5 py-1.5 ${t.box}`}>
                <span data-plain-math className={`shrink-0 rounded-lg px-2 py-1 font-display text-[15px] font-extrabold leading-none ${t.chip}`}>
                  <Tex tex={p.sym} />
                </span>
                <span className="text-[13px] font-semibold leading-snug text-ink">{p.means}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Two or three things side by side, so the difference is the picture. */
export function CompareView({ block }: { block: CompareBlock }) {
  return (
    <div className="mt-3">
      <div className={`grid gap-2 ${block.cols.length > 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
        {block.cols.map((c, i) => {
          const t = TONE[c.tone ?? 'plain'];
          return (
            <div key={i} className={`rounded-2xl border-2 p-2.5 ${t.box}`}>
              <div className={`font-display text-[12px] font-extrabold tracking-wide ${t.label}`}>{c.title}</div>
              {c.tex && (
                <div className="mt-1.5 overflow-x-auto text-ink" style={{ fontSize: 'clamp(0.85rem, 4vw, 1.05rem)' }}>
                  <Tex tex={c.tex} />
                </div>
              )}
              <ul className="mt-1.5 space-y-1">
                {c.lines.map((l, j) => (
                  <li key={j} className="text-[13px] font-semibold leading-snug text-ink">{l}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {block.note && (
        <p className="mt-2 text-center text-[13px] font-display font-bold text-ink-muted">{block.note}</p>
      )}
    </div>
  );
}

/** A worked run: one numbered box per step, the answer in its own frame. */
export function StepsView({ block }: { block: StepsBlock }) {
  return (
    <div className="mt-3 space-y-1.5">
      {block.steps.map((s, i) => (
        <div key={i} className="flex gap-2.5 rounded-xl border-2 border-line bg-surface-2 px-2.5 py-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[11px] font-extrabold text-on-accent">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            {s.tex && (
              <div className="overflow-x-auto text-ink" style={{ fontSize: 'clamp(0.9rem, 4.4vw, 1.1rem)' }}>
                <Tex tex={s.tex} />
              </div>
            )}
            <div className={`text-[13px] font-semibold leading-snug text-ink-muted ${s.tex ? 'mt-0.5' : ''}`}>{s.text}</div>
          </div>
        </div>
      ))}
      {block.answer && (
        <div className="flex items-center gap-2 rounded-xl border-2 border-ok/50 bg-ok-soft px-3 py-2">
          <span className="font-display text-[11px] font-extrabold uppercase tracking-wider text-ok">Answer</span>
          <span data-plain-math className="overflow-x-auto font-display text-[17px] font-extrabold text-ink">
            <Tex tex={block.answer} />
          </span>
        </div>
      )}
    </div>
  );
}

/** A small table of values — for a pattern you read down a column. */
export function TableView({ block }: { block: TableBlock }) {
  return (
    <div className="mt-3">
      <div className="overflow-x-auto rounded-2xl border-2 border-line">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-surface-2">
              {block.head.map((h, i) => (
                <th key={i} className="border-b-2 border-line px-2 py-1.5 font-display text-[12px] font-extrabold tracking-wide text-ink-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r, i) => (
              <tr key={i} className={i === block.mark ? 'bg-warn-soft' : ''}>
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`border-t border-line px-2 py-1.5 text-[14px] tabular-nums text-ink ${
                      i === block.mark ? 'font-display font-extrabold' : 'font-semibold'
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && <p className="mt-2 text-center text-[13px] font-display font-bold text-ink-muted">{block.note}</p>}
    </div>
  );
}

/** A drawing. Ink is `currentColor`, so it follows the card in light and dark. */
export function ArtView({ art }: { art: SlideArt }) {
  return (
    <figure className="mt-3">
      <div
        role="img"
        aria-label={art.alt}
        className="mx-auto w-full max-w-[26rem] text-ink [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: art.svg }}
      />
      {art.caption && (
        <figcaption className="mt-1.5 text-center text-[13px] font-display font-bold leading-snug text-ink-muted">
          {art.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── the slide's prose, given some typography ───────────────────────────────

/** A run of 2+ capitals is the decks' own emphasis convention (NOT, BOTH, ALL). */
const SHOUT = /\b[A-Z][A-Z-]{1,}\b/g;
/** `**like this**` for emphasis that is not a single shouted word. */
const STARS = /\*\*([^*]+)\*\*/g;

/**
 * A line that is really just a worked step — "3(−4) = −12." — rather than a
 * sentence about one. It gets set apart instead of running on as prose.
 */
function isMathLine(line: string): boolean {
  if (!line.includes('=')) return false;
  // "Is this really that? Test x = 5." is a question about a step, not a step
  if (line.includes('?') && !/=\s*\?\s*$/.test(line)) return false;
  const words = line.match(/\b[A-Za-z]{3,}\b/g) ?? [];
  return words.length <= 2 && line.length <= 64;
}

/**
 * An expression inside a sentence — "x + 5 = 9", "3(−4) + 2", "½ × ½" — set
 * apart as an equation chip. It has to contain an operator: "3 and 4" is not
 * mathematics. ASCII hyphen is deliberately not an operator, or step-by-step
 * would be one; the decks write subtraction with a real minus sign.
 */
const TOKEN = '[A-Za-z0-9()\\u00bc-\\u00be\\u00b2\\u00b3\\u00b9\\u2070-\\u209f.,/]+';
const OPER = '\\s*[+\\u2212\\u00d7\\u00f7=<>\\u2264\\u2265\\u2260\\u00b1\\u00b7]\\s*';
const INLINE_MATH = new RegExp(`(?<![\\w])${TOKEN}(?:${OPER}${TOKEN})+(?![\\w])`, 'g');

/** Names that may appear as a bare word inside an expression. */
const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'sqrt', 'abs', 'max', 'min', 'mod']);
/** Short English words that would otherwise pass as variables: "of −15", "at −2". */
const STOPWORDS = new Set(['of', 'at', 'to', 'in', 'on', 'is', 'as', 'by', 'or', 'an', 'so', 'if', 'up', 'no', 'be', 'do', 'it', 'we', 'he', 'me', 'my', 'us', 'am', 'go']);

/**
 * The pattern is loose on purpose, so the judgement lives here: an operand
 * is a number, a short variable like x or 2x, or a function name. "muffin =
 * total" and "but −2" have operators but are still prose.
 */
function isExpression(raw: string): boolean {
  const tokens = raw.split(new RegExp(OPER)).map((t) => t.replace(/[().,]/g, ''));
  let anchored = false;
  for (const t of tokens) {
    if (!t) continue;
    if (/\d/.test(t)) {
      anchored = true;
      continue;
    }
    if (/^[A-Za-z]+$/.test(t)) {
      const w = t.toLowerCase();
      if (STOPWORDS.has(w)) return false;
      if (t.length <= 2) anchored = true;
      else if (!FUNCTIONS.has(w)) return false;
      continue;
    }
  }
  return anchored;
}

/** Punctuation the loose pattern swallows at an edge — "= 3." or "(both". */
function trimEdges(raw: string): [string, string, string] {
  let head = '';
  let tail = '';
  let body = raw;
  const m = body.match(/[.,]+$/);
  if (m) {
    tail = m[0];
    body = body.slice(0, -tail.length);
  }
  const opens = (body.match(/\(/g) ?? []).length;
  const closes = (body.match(/\)/g) ?? []).length;
  if (body.startsWith('(') && opens > closes) {
    head = '(';
    body = body.slice(1);
  } else if (body.endsWith(')') && closes > opens) {
    tail = ')' + tail;
    body = body.slice(0, -1);
  }
  return [head, body, tail];
}

/** Wrap each inline expression in a piece of prose as an equation chip. */
function withInlineMath(piece: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  INLINE_MATH.lastIndex = 0;
  while ((m = INLINE_MATH.exec(piece))) {
    const [head, body, tail] = trimEdges(m[0]);
    if (!isExpression(body)) continue;
    if (m.index > last) out.push(piece.slice(last, m.index));
    if (head) out.push(head);
    out.push(
      <span key={`${key}-m${m.index}`} className="eq">
        {body}
      </span>,
    );
    if (tail) out.push(tail);
    last = m.index + m[0].length;
  }
  if (last < piece.length) out.push(piece.slice(last));
  return out;
}

/** Style the emphasis the decks already use, rather than leaving it shouting. */
function emphasise(line: string, key: string) {
  const out: React.ReactNode[] = [];
  let rest = line;
  let n = 0;
  // **stars** first, so a shouted word inside them still gets picked up after
  rest = rest.replace(STARS, (_m, inner) => `\u0001${inner}\u0001`);
  for (const piece of rest.split('\u0001')) {
    const starred = n % 2 === 1;
    let last = 0;
    let m: RegExpExecArray | null;
    SHOUT.lastIndex = 0;
    const kids: React.ReactNode[] = [];
    while ((m = SHOUT.exec(piece))) {
      if (m.index > last) kids.push(...withInlineMath(piece.slice(last, m.index), `${key}-${n}-${last}`));
      kids.push(
        <b key={`${key}-${n}-${m.index}`} className="font-display font-extrabold text-accent">
          {m[0]}
        </b>,
      );
      last = m.index + m[0].length;
    }
    if (last < piece.length) kids.push(...withInlineMath(piece.slice(last), `${key}-${n}-${last}`));
    out.push(
      starred ? (
        <b key={`${key}-s${n}`} className="font-bold text-ink">
          {kids}
        </b>
      ) : (
        <span key={`${key}-p${n}`}>{kids}</span>
      ),
    );
    n += 1;
  }
  return out;
}

/**
 * A slide body, set as typography rather than one grey block. Each authored
 * line becomes its own paragraph, the emphasis the decks already write in
 * capitals is rendered as emphasis, and a line that is purely a worked step is
 * lifted into its own bounded chip.
 */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, i) =>
        isMathLine(line) ? (
          <div
            key={i}
            className="rounded-xl border-2 border-accent/35 bg-accent-soft px-3 py-2 text-center font-display text-[16px] font-extrabold tracking-tight text-ink nums-tabular"
          >
            {line.replace(/\.$/, '')}
          </div>
        ) : (
          <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
            {emphasise(line, String(i))}
          </p>
        ),
      )}
    </div>
  );
}
