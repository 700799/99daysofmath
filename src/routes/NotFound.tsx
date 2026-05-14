import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-3">🦉</div>
      <h1 className="text-2xl font-display font-extrabold text-slate-900">
        Lost on the trail
      </h1>
      <p className="text-slate-600 mt-2">That page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold"
      >
        Back to home
      </Link>
    </div>
  );
}
