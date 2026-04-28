/**
 * Fetches data from a URL with a timeout.
 * If the request takes longer than `timeoutMs`, it is aborted.
 *
 * FIX 1: Passes the signal to fetch so abort actually cancels the request.
 * FIX 2: Clears the timeout timer on success to prevent stale aborts.
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  fetchFn: typeof fetch = fetch
): Promise<Response> {
  const controller = new AbortController();

  // FIX: Store the timer ID so we can clear it on success
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    // FIX: Pass the signal to fetch so the abort actually cancels the request
    const response = await fetchFn(url, { signal: controller.signal });

    // FIX: Clear the timeout to prevent a stale abort after success
    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Runs an async operation that can be cancelled by an external signal.
 *
 * FIX 3: Checks if the signal is already aborted before starting.
 * Races the operation against the abort event so cancellation during
 * execution properly rejects the promise.
 */
export async function cancellableOperation<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal
): Promise<T> {
  // FIX: Check if signal is already aborted
  if (signal.aborted) {
    throw new DOMException("The operation was aborted.", "AbortError");
  }

  // FIX: Race the operation against the abort event
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      reject(new DOMException("The operation was aborted.", "AbortError"));
    };

    signal.addEventListener("abort", onAbort, { once: true });

    operation(signal).then(
      (result) => {
        signal.removeEventListener("abort", onAbort);
        resolve(result);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      }
    );
  });
}

/**
 * Creates a debounced async function that cancels the previous pending
 * invocation when called again. Uses AbortController to cancel in-flight work.
 *
 * FIX 4: Aborts the previous controller before creating a new one.
 * FIX 5: The cancel function also aborts the controller.
 */
export function createCancellableDebounce<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  delayMs: number
): { trigger: () => Promise<T | undefined>; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;
  // FIX: Track the pending promise's resolve so cancel() can settle it
  let pendingResolve: ((value: T | undefined) => void) | null = null;

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    // FIX: Abort the controller to cancel any in-flight work
    if (controller) {
      controller.abort();
      controller = null;
    }
    // FIX: Resolve the pending promise with undefined so it doesn't hang
    if (pendingResolve) {
      pendingResolve(undefined);
      pendingResolve = null;
    }
  }

  async function trigger(): Promise<T | undefined> {
    // FIX: Abort the previous controller before creating a new one
    cancel();

    controller = new AbortController();
    const currentController = controller;

    return new Promise<T | undefined>((resolve) => {
      pendingResolve = resolve;
      timeoutId = setTimeout(async () => {
        pendingResolve = null;
        try {
          const result = await fn(currentController.signal);
          resolve(result);
        } catch {
          resolve(undefined);
        }
      }, delayMs);
    });
  }

  return { trigger, cancel };
}

/**
 * Registers an event listener that is automatically removed when
 * the provided signal is aborted.
 *
 * FIX 6: Passes the signal option to addEventListener so the listener
 * is automatically removed on abort.
 */
export function addAbortableEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener,
  signal: AbortSignal
): void {
  // FIX: If the signal is already aborted, don't add the listener at all.
  if (signal.aborted) {
    return;
  }

  // FIX: Pass { signal } so the browser automatically removes
  // the listener when the signal is aborted.
  target.addEventListener(event, handler, { signal });
}
