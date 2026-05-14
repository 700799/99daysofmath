interface Props {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ stars, size = 'md' }: Props) {
  const cls = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-base' : 'text-2xl';
  return (
    <div className={`inline-flex items-center gap-1 ${cls}`} aria-label={`${stars} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < stars ? '' : 'opacity-25 grayscale'}>
          ⭐
        </span>
      ))}
    </div>
  );
}
