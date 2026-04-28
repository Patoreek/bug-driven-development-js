# Hint 2 -- Medium

Six specific fixes:

1. **`fetchWithTimeout` -- pass signal**: `fetch(url, { signal: controller.signal })` makes the abort actually cancel the request.

2. **`fetchWithTimeout` -- clear timeout**: Store the timer ID and call `clearTimeout(timeoutId)` after the fetch resolves. Use try/finally or try/catch to ensure cleanup.

3. **`cancellableOperation` -- check aborted**: Before starting, check `if (signal.aborted) throw new DOMException(...)`.

4. **`cancellableOperation` -- listen for abort**: Use `signal.addEventListener("abort", ...)` and race it against the operation's promise. Remove the listener when done.

5. **`createCancellableDebounce` -- abort previous and resolve pending**: In the `cancel()` function, call `controller.abort()` AND resolve the pending promise with `undefined` so it doesn't hang forever. Track the resolve function in a variable so `cancel()` can call it.

6. **`addAbortableEventListener` -- pass signal**: `target.addEventListener(event, handler, { signal })` auto-removes the listener when the signal is aborted. Also guard against an already-aborted signal by checking `signal.aborted` before adding.
