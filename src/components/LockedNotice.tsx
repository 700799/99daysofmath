import { Link } from 'react-router-dom';
import { Icon } from '../icons/Icon';

interface Props {
  gameName: string;
  /** Stars still needed before this game unlocks. */
  need: number;
}

/** Shown when a reward game hasn't been unlocked yet. */
export function LockedNotice({ gameName, need }: Props) {
  return (
    <div className="text-center">
      <Link to="/rewards" className="text-sm font-display font-bold text-slate-500 hover:text-slate-700">
        ← Arcade
      </Link>
      <div className="mt-10 flex justify-center">
        <Icon name="lock" size={72} label="Locked" />
      </div>
      <h1 className="mt-4 text-2xl font-display font-extrabold text-slate-900">
        {gameName} is locked
      </h1>
      <p className="mt-2 text-slate-600 flex items-center justify-center gap-1.5">
        <span>Earn</span>
        <span className="font-bold text-amber-600 inline-flex items-center gap-1">
          {need} more <Icon name="star" size={18} label="stars" />
        </span>
        <span>on the math trails to unlock it.</span>
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-sm"
      >
        Go practice math
      </Link>
    </div>
  );
}
