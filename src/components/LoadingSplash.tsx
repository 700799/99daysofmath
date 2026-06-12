import { Icon } from '../icons/Icon';

/** Friendly loading state used by route suspense and data fetches. */
export function LoadingSplash({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <Icon name="dice" size={48} className="animate-bounce" />
      <div className="mt-3 font-display font-bold">{text}</div>
    </div>
  );
}
