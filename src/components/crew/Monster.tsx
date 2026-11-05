import { forwardRef, type CSSProperties } from 'react';
import { crewById, crewSvgMarkup } from './crewData';
import './crew.css';

interface Props {
  id: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/**
 * One crew member as an inline SVG. The drawing is static markup from
 * crewData (our own constants, no user input). Motion lives in crew.css and is
 * switched on by classes the parent adds: `bulge`, `nod`, `shake`, `brainy`.
 */
export const Monster = forwardRef<SVGSVGElement, Props>(function Monster({ id, className, style, title }, ref) {
  const m = crewById(id);
  // A stable per-member blink clock so the crew never blinks in unison.
  const seed = [...m.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const vars = {
    '--c': m.c,
    '--c2': m.c2,
    '--acc': m.acc ?? '#ff6ad5',
    '--bl': `${4 + (seed % 30) / 10}s`,
    '--bd': `-${(seed % 50) / 10}s`,
    ...style,
  } as CSSProperties;
  return (
    <svg
      ref={ref}
      className={`crew-mon ${className ?? ''}`}
      viewBox="-6 -40 224 286"
      style={vars}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: crewSvgMarkup(m) }}
    />
  );
});
