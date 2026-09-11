import { useMemo } from 'react';
import katex from 'katex';
import type { MathFigure } from '../data/mathematicianDecks';

interface Props {
  figure: MathFigure;
}

/**
 * The illustration beside a mathematician's story. A figure is either typeset
 * mathematics or a drawn diagram — in both cases the picture IS the idea being
 * told, so a kid who only looks at the pictures still learns something.
 */
export function MathFigureView({ figure }: Props) {
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
          className="w-full max-w-[32rem] text-center text-white [&_.katex-display]:my-2"
          style={{ fontSize: 'min(6vw, 2.15rem)' }}
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      ) : (
        <div
          role="img"
          aria-label={figure.alt}
          className="w-full max-w-[34rem]"
          dangerouslySetInnerHTML={{ __html: figure.svg }}
        />
      )}
      {figure.caption && (
        <p className="max-w-[26rem] text-center font-display text-[13px] font-bold leading-snug text-violet-200 sm:text-sm">
          {figure.caption}
        </p>
      )}
    </div>
  );
}
