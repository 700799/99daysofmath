/**
 * Tiny wrapper around the Vibration API. Modern iOS Safari ignores
 * navigator.vibrate but still respects user gestures — most Android phones,
 * tablets, and Chrome on iOS DO vibrate. Silently no-ops on unsupported
 * devices so call sites stay clean.
 *
 * Patterns are kept small (≤ 20ms taps) — kid devices, not toys.
 */

type Pattern = number | number[];

function vibrate(pattern: Pattern): void {
  if (typeof navigator === 'undefined') return;
  // The Web API expects `number | number[]` — single short patterns are fine.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (navigator as any).vibrate as
    | ((p: number | number[]) => boolean)
    | undefined;
  if (typeof v === 'function') {
    try {
      v.call(navigator, pattern as number | number[]);
    } catch {
      /* unsupported / blocked */
    }
  }
}

/** Soft confirmation for `Next` / `Continue` style buttons. */
export function tapHaptic(): void {
  vibrate(10);
}

/** Snappier feedback for `Submit` / `Check` answer buttons. */
export function submitHaptic(): void {
  vibrate(15);
}

/** Two short pulses — "you got it right" celebration. */
export function successHaptic(): void {
  vibrate([12, 60, 12]);
}

/** Single dull thump — gentle "try again". */
export function errorHaptic(): void {
  vibrate(30);
}
