import { ICONS, type IconName } from './registry';

interface Props {
  name: IconName;
  /** Rendered width/height in px. */
  size?: number;
  className?: string;
  /** Accessible label; omit for purely decorative icons (aria-hidden). */
  label?: string;
}

/**
 * Renders one of the app's hand-drawn SVG icons. The markup comes from our
 * own static registry (never user content), so innerHTML is safe here.
 */
export function Icon({ name, size = 24, className, label }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
