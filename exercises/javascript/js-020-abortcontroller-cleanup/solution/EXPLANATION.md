# Explanation: AbortController Cleanup

## Why the Bug Happens

`AbortController` is the standard mechanism for cancellation in JavaScript. It consists of two parts:
- **AbortController**: The object that triggers cancellation via `.abort()`
- **AbortSignal**: The signal object that receives the cancellation event

The controller is useless unless the signal is actually **connected** to the thing you want to cancel. All six bugs stem from signals that exist but are never wired up properly.

### Bug 1: Signal not passed to fetch

```typescript
// Before (buggy) -- abort fires, but fetch doesn't know about it
const response = await fetchFn(url);

// After (fixed) -- fetch listens for the signal and cancels when aborted
const response = await fetchFn(url, { signal: controller.signal });
```

`fetch` only responds to abort if you pass `{ signal }` in its options. Without it, calling `controller.abort()` does nothing.

### Bug 2: Timeout not cleared on success

```typescript
// Before (buggy) -- timeout fires after fetch already completed
setTimeout(() => controller.abort(), timeoutMs);

// After (fixed) -- store ID and clear on success/failure
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
try {
  const response = await fetchFn(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  throw error;
}
```

### Bug 3: Not checking `signal.aborted`

```typescript
// Before (buggy) -- starts the operation even if already cancelled
return operation(signal);

// After (fixed) -- reject immediately if signal is already aborted
if (signal.aborted) {
  throw new DOMException("The operation was aborted.", "AbortError");
}
```

Always check `signal.aborted` synchronously before starting async work. The signal may have been aborted before your function was even called.

### Bug 4: Not racing against the abort event

```typescript
// After (fixed) -- race operation against abort event
return new Promise((resolve, reject) => {
  const onAbort = () => reject(new DOMException("...", "AbortError"));
  signal.addEventListener("abort", onAbort, { once: true });
  operation(signal).then(
    (result) => { signal.removeEventListener("abort", onAbort); resolve(result); },
    (error) => { signal.removeEventListener("abort", onAbort); reject(error); }
  );
});
```

### Bug 5: Previous controller not aborted

```typescript
// Before (buggy) -- cancel() only clears the timeout, not the controller
function cancel() {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
}

// After (fixed) -- abort the controller and resolve pending promise
let pendingResolve: ((value: T | undefined) => void) | null = null;

function cancel() {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
  if (controller) { controller.abort(); controller = null; }
  if (pendingResolve) { pendingResolve(undefined); pendingResolve = null; }
}
```

The `pendingResolve` pattern ensures that when `cancel()` clears the timeout, the promise returned by `trigger()` is still settled (with `undefined`) rather than hanging forever. Without it, any code `await`ing the trigger result would block indefinitely.

### Bug 6: Signal not passed to addEventListener

```typescript
// Before (buggy) -- listener is never auto-removed
target.addEventListener(event, handler);

// After (fixed) -- guard against already-aborted signal and auto-remove on abort
if (signal.aborted) return;
target.addEventListener(event, handler, { signal });
```

The `{ signal }` option was added to `addEventListener` specifically for this purpose. When the signal is aborted, the browser automatically removes the listener -- no need for manual `removeEventListener`. The guard for `signal.aborted` ensures we don't add a listener that would fire before being removed.

## The AbortController Pattern

```
AbortController  --creates-->  AbortSignal
     |                              |
  .abort()                  .aborted (boolean)
                            "abort" event
                            passed to: fetch, addEventListener, etc.
```

Key rules:
1. One controller can signal many consumers (pass the signal to multiple fetch calls, listeners, etc.)
2. Abort is one-way -- once aborted, a signal stays aborted forever
3. Always create a new controller for each cancellable scope (don't reuse)
4. Always check `signal.aborted` synchronously before starting work

## Common Variations

1. **AbortSignal.timeout()**: `fetch(url, { signal: AbortSignal.timeout(5000) })` is a built-in shortcut for fetch-with-timeout
2. **AbortSignal.any()**: Combines multiple signals -- aborts when any one of them fires
3. **React useEffect cleanup**: Use AbortController in useEffect to cancel fetches on unmount
4. **Node.js streams**: AbortController works with Node.js readable/writable streams too

## Interview Context

AbortController questions are increasingly common, especially for senior roles. Interviewers look for:
- Understanding the controller/signal separation of concerns
- Knowing that signals must be explicitly connected to consumers
- Proper cleanup patterns (clearing timeouts, removing listeners)
- Experience with real-world cancellation scenarios (search debounce, component unmount)
- Knowledge of newer APIs like `AbortSignal.timeout()` and `AbortSignal.any()`

## References

- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [MDN: fetch() - Using AbortController](https://developer.mozilla.org/en-US/docs/Web/API/fetch#aborting_a_fetch)
- [MDN: addEventListener - signal option](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal)
- [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
