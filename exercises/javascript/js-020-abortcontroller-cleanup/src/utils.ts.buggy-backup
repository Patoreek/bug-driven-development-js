/**
 * Fetches data from a URL with a timeout.
 * If the request takes longer than `timeoutMs`, it should be aborted.
 *
 * BUG 1: Creates an AbortController but never passes the signal to fetch,
 * so the abort has no effect and the request is never actually cancelled.
 *
 * BUG 2: The timeout timer is never cleared on success, which can cause
 * the abort to fire after the request has already completed (and trigger
 * an unhandled error in some environments).
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  fetchFn: typeof fetch = fetch
): Promise<Response> {
  const controller = new AbortController();

  // BUG: Timer is created but never cleared on success
  setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  // BUG: Signal is not passed to fetch, so abort has no effect
  const response = await fetchFn(url);

  return response;
}

/**
 * Runs an async operation that can be cancelled by an external signal.
 *
 * BUG 3: Does not check if the signal is already aborted before starting,
 * and does not listen for abort events during the operation.
 */
export async function cancellableOperation<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal
): Promise<T> {
  // BUG: Should check signal.aborted before starting
  // If the signal is already aborted, this should reject immediately.

  // BUG: Should listen for the abort event and reject the operation
  // if cancellation happens during execution.
  return operation(signal);
}

/**
 * Creates a debounced async function that cancels the previous pending
 * invocation when called again. Uses AbortController to cancel in-flight work.
 *
 * BUG 4: Creates a new AbortController per call but never aborts the
 * previous one, so multiple invocations run in parallel instead of
 * cancelling the previous one.
 *
 * BUG 5: Does not resolve the pending promise when cancelled, causing
 * the trigger() promise to hang forever if cancel() is called.
 */
export function createCancellableDebounce<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  delayMs: number
): { trigger: () => Promise<T | undefined>; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  // BUG: Creates a new controller but never aborts the previous one
  let controller: AbortController | null = null;

  function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    // BUG: Does not abort the controller, so in-flight work continues
  }

  async function trigger(): Promise<T | undefined> {
    // BUG: Should abort the previous controller before creating a new one
    cancel();

    controller = new AbortController();

    return new Promise<T | undefined>((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(controller!.signal);
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
 * BUG 6: Does not pass the signal option to addEventListener,
 * so the listener is never automatically removed.
 */
export function addAbortableEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener,
  signal: AbortSignal
): void {
  // BUG: Should pass { signal } as the third argument so the listener
  // is automatically removed when the signal is aborted.
  target.addEventListener(event, handler);
}
