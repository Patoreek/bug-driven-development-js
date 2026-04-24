/**
 * Creates a debounced version of the provided function.
 * The debounced function delays invoking `fn` until after `delay` milliseconds
 * have elapsed since the last time it was called.
 *
 * If called repeatedly, only the LAST call's arguments should be used
 * when the function finally fires.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced version of fn
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  // BUG: Timer ID is declared but never used to clear the previous timer.
  // Each call creates a NEW timer without canceling the old one.
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    // Missing: clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Creates a throttled version of the provided function.
 * The throttled function only invokes `fn` at most once per `limit` milliseconds.
 *
 * The first call should execute immediately. Subsequent calls within the
 * time window are ignored. After the window expires, the next call executes.
 *
 * @param fn - The function to throttle
 * @param limit - Minimum time between invocations in milliseconds
 * @returns A throttled version of fn
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  // BUG: The flag is set but never reset, so only the first call ever executes.
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      // BUG: Missing the setTimeout to reset inThrottle after `limit` ms
    }
  };
}
