import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../state/progress';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  const totalStars = useProgress((s) => s.totalStars());
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  return (
    <div className="min-h-full flex flex-col">
      <header
        className="sticky top-0 z-10 bg-white border-b border-slate-200"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {isHome ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦉</span>
              <span className="font-display font-extrabold text-xl text-slate-900">
                99 Days of Math
              </span>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <span className="text-2xl">←</span>
              <span className="font-display font-bold">Home</span>
            </Link>
          )}
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
            <span className="text-xl">⭐</span>
            <span className="font-display font-bold text-amber-900">
              {totalStars}
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
