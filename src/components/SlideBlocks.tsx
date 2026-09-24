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
      <div className="rounded-2xl border-2 border-accent/45 bg-surface px-3 py-3 shadow-sm">
        <div className="overflow-x-auto text-center text-ink [&_.katex-display]:my-0" style={{ fontSize: 'clamp(1rem, 5.2vw, 1.4rem)' }}>
          <Tex tex={block.tex} display />
        </div>
        {block.note && (
          <p className="mt-2 border-t border-line pt-2 text-center text-[13px] font-display font-bold leading-snug text-ink-muted">
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
                <span className={`shrink-0 rounded-lg px-2 py-1 font-display text-[15px] font-extrabold leading-none ${t.chip}`}>
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
          <span className="overflow-x-auto font-display text-[17px] font-extrabold text-ink">
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
