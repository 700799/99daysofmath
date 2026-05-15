import { useMemo } from 'react';
import { renderMathText } from '../utils/katex';

interface Props {
  text: string;
  className?: string;
}

export function MathText({ text, className }: Props) {
  const html = useMemo(() => renderMathText(text), [text]);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
