import { Link, useLocation } from 'react-router-dom';
import { trailOf, titleOf } from '../utils/navHierarchy';

// Where you are, as a row of links: Home › Trigonometry › Unit 3. Every crumb
// but the last is a link, so any level above is one tap away. Scrolls
// sideways on a phone rather than wrapping into the content.
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const trail = trailOf(pathname);
  if (trail.length === 0) return null;
  const here = titleOf(pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-3xl mx-auto px-4 pb-2 -mt-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex items-center gap-1 whitespace-nowrap font-display text-xs font-bold">
        {trail.map((c, i) => (
          <li key={c.to} className="flex items-center gap-1">
            {i > 0 && <span className="text-ink-dim" aria-hidden="true">›</span>}
            <Link
              to={c.to}
              className="inline-flex min-h-8 items-center rounded-md px-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              {c.to === '/' ? '🏠 Home' : c.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-1" aria-current="page">
          <span className="text-ink-dim" aria-hidden="true">›</span>
          <span className="inline-flex min-h-8 items-center px-1.5 text-ink">{here}</span>
        </li>
      </ol>
    </nav>
  );
}
