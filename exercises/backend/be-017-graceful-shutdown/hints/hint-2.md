# Hint 2 (Medium)

The flow should be:

1. `handleRequest`: Increment `activeRequests` before processing, decrement in a `finally` block. If `isShuttingDown` is true, return 503 immediately.

2. `shutdown`: Set `isShuttingDown = true`. If there are active requests, wait for them to drain (how can `handleRequest` notify `shutdown` when the count reaches zero?). Then run cleanup functions.

3. `registerSignalHandlers`: Call `onSignal` for both "SIGTERM" and "SIGINT", passing a handler that calls `shutdown()`.
