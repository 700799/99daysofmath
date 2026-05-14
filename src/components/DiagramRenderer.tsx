import type { Diagram } from '../types/problem';

interface Props {
  diagram: Diagram;
  className?: string;
}

export function DiagramRenderer({ diagram, className }: Props) {
  const base = import.meta.env.BASE_URL;
  if (diagram.kind === 'svg-asset') {
    const src = diagram.src.startsWith('/')
      ? `${base.replace(/\/$/, '')}${diagram.src}`
      : `${base}${diagram.src}`;
    return (
      <img
        src={src}
        alt={diagram.alt}
        className={className ?? 'mx-auto my-4 max-w-full'}
        loading="lazy"
      />
    );
  }
  if (diagram.kind === 'inline-svg') {
    return (
      <div
        role="img"
        aria-label={diagram.alt}
        className={className ?? 'mx-auto my-4'}
        dangerouslySetInnerHTML={{ __html: diagram.svg }}
      />
    );
  }
  return (
    <pre
      className={
        className ??
        'mx-auto my-4 font-mono text-sm bg-slate-100 p-3 rounded whitespace-pre'
      }
    >
      {diagram.art}
    </pre>
  );
}
