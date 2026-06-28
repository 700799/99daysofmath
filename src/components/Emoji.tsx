import { useMemo } from 'react';
import twemoji from '@twemoji/api';

// Renders an emoji as a crisp Twemoji SVG (consistent across every device)
// instead of the platform's native glyph.
export function Emoji({
  e,
  size = 24,
  className = '',
  title,
}: {
  e: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const html = useMemo(() => twemoji.parse(e, { folder: 'svg', ext: '.svg' }), [e]);
  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-block align-middle leading-none [&>img]:w-full [&>img]:h-full [&>img]:block ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
