export type DebouncedFn<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): DebouncedFn<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
      lastArgs = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId !== null && lastArgs !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  return debounced;
}

export function createAutoSave(
  saveFn: (data: string) => void,
  interval: number
): { update: (data: string) => void; stop: () => void } {
  let latestData: string | null = null;
  let timerId: ReturnType<typeof setInterval> | null = null;

  const start = () => {
    timerId = setInterval(() => {
      if (latestData !== null) {
        saveFn(latestData);
        latestData = null;
      }
    }, interval);
  };

  start();

  return {
    update: (data: string) => {
      latestData = data;
    },
    stop: () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    },
  };
}
