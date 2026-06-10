import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { Icon } from '../icons/Icon';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  const totalStars = useProgress((s) => s.totalStars());
  const coins = useProgress((s) => s.coins);
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
              <Icon name="owl" size={30} label="99 Days of Math owl mascot" />
              <span className="font-display font-extrabold text-xl text-slate-900">
                99 Days of Math
              </span>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <span className="text-2xl" aria-hidden="true">←</span>
              <span className="font-display font-bold">Home</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Link
              to="/rewards"
              aria-label={`Rewards arcade, ${coins} coins`}
              className="flex items-center gap-1.5 bg-violet-100 hover:bg-violet-200 px-3 py-1 rounded-full transition-colors"
            >
              <Icon name="coin" size={20} />
              <span className="font-display font-bold text-violet-900 tabular-nums">{coins}</span>
            </Link>
            <div
              className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full"
              aria-label={`${totalStars} stars earned`}
            >
              <Icon name="star" size={20} />
              <span className="font-display font-bold text-amber-900 tabular-nums">
                {totalStars}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
