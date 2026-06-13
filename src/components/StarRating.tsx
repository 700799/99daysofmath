import { Icon } from '../icons/Icon';

interface Props {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
}

const PX = { sm: 16, md: 26, lg: 42 } as const;

export function StarRating({ stars, size = 'md' }: Props) {
  const px = PX[size];
  return (
    <div
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`${stars} of 3 stars`}
    >
      {[0, 1, 2].map((i) => (
        <Icon key={i} name={i < stars ? 'star' : 'star-dim'} size={px} />
      ))}
    </div>
  );
}
