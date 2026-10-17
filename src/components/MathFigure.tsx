import { useMemo } from 'react';
import katex from 'katex';
import type { MathFigure } from '../data/mathematicianDecks';

interface Props {
  figure: MathFigure;
  /** 'light' redraws the figure for a light pane: the same hues, darkened for contrast. */
  tone?: 'dark' | 'light';
}

// The figures are drawn in a light-on-indigo palette. On a light pane each
// colour maps to a darker shade of the same hue (keeping any alpha suffix), so
// every label stays at least 4.5:1 against white.
const LIGHT: Record<string, string> = {
  ece9ff: '1e293b', // ink → slate-800
  a5b4fc: '52525b', // dim → zinc-600
  fbbf24: 'b45309', // highlight → amber-700
  f59e0b: 'b45309',
  '60a5fa': '1d4ed8', // sky → blue-700
  '34d399': '047857', // ok → emerald-700
  f472b6: 'be185d', // no → pink-700
  f87171: 'b91c1c', // red → red-700
  cbd5e1: '475569',
  '1e1b4b': 'ffffff', // dark text on a highlight fill → white on the darker fill
  '312e81': 'ffffff', // the old pane colour, used as a knock-out fill
};

export function toLight(svg: string): string {
  // Dark labels printed on a coloured fill turn white; a thin dark outline keeps
  // them readable whether that fill came out deep or pale.
  const haloed = svg.replace(
    /<text([^>]*?) fill="#1e1b4b"/gi,
    '<text$1 fill="#ffffff" stroke="#1e293b" stroke-width="2.5" paint-order="stroke" stroke-linejoin="round"',
  );
  return haloed.replace(/#([0-9a-fA-F]{6})(?=[0-9a-fA-F]{0,2}\b)/g, (m, hex: string) => {
    const to = LIGHT[hex.toLowerCase()];
    return to ? `#${to}` : m;
  });
}

/**
 * The illustration beside a mathematician's story. A figure is either typeset
 * mathematics or a drawn diagram — in both cases the picture IS the idea being
 * told, so a kid who only looks at the pictures still learns something.
 */
export function MathFigureView({ figure, tone = 'dark' }: Props) {
  const light = tone === 'light';
  const svg = useMemo(() => (figure.kind === 'svg' && light ? toLight(figure.svg) : figure.kind === 'svg' ? figure.svg : ''), [figure, light]);
  const mathHtml = useMemo(() => {
    if (figure.kind !== 'math') return '';
    return figure.tex
      .map((t) =>
        katex.renderToString(t, { displayMode: true, throwOnError: false, output: 'html' }),
      )
      .join('');
  }, [figure]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-4 sm:px-6">
      {figure.kind === 'math' ? (
        <div
          className={`w-full max-w-[32rem] text-center [&_.katex-display]:my-2 ${light ? 'text-slate-900' : 'text-white'}`}
          style={{ fontSize: 'min(6vw, 2.15rem)' }}
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      ) : (
        <div
          role="img"
          aria-label={figure.alt}
          className="w-full max-w-[34rem]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      {figure.caption && (
        <p className={`max-w-[26rem] text-center font-display text-[13px] font-bold leading-snug sm:text-sm ${light ? 'text-slate-600' : 'text-violet-200'}`}>
          {figure.caption}
        </p>
      )}
    </div>
  );
}
