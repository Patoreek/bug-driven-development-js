# Solution: Graceful Shutdown

## The Bug

The server had no shutdown logic at all:
- `shutdown()` was an empty function that didn't change any state
- `handleRequest()` didn't check for shutdown state or track active requests
- `registerSignalHandlers()` didn't register any signal handlers

This meant the process would be killed abruptly, dropping all in-flight connections.

## The Fix

### 1. Track active requests in `handleRequest`
```ts
state.activeRequests++;
try {
  return await handler(req);
} finally {
  state.activeRequests--;
  if (state.activeRequests === 0 && drainResolve) {
    drainResolve();
  }
}
```
The `finally` block ensures the count decreases even if the handler throws. When the count hits zero during shutdown, the drain promise resolves.

### 2. Reject new requests during shutdown
```ts
if (state.isShuttingDown) {
  return { status: 503, body: "Service is shutting down" };
}
```

### 3. Implement `shutdown` with connection draining
```ts
state.isShuttingDown = true;
if (state.activeRequests > 0) {
  await new Promise<void>((resolve) => { drainResolve = resolve; });
}
for (const fn of state.cleanupFns) {
  await fn();
}
```
The shutdown function waits for all active requests to complete, then runs cleanup callbacks.

### 4. Register signal handlers
```ts
onSignal("SIGTERM", handler);
onSignal("SIGINT", handler);
```

## Key Takeaway

Graceful shutdown is essential for zero-downtime deployments. The pattern is: (1) stop accepting new work, (2) drain existing work, (3) clean up resources, (4) exit. Without this, every deployment causes errors for users whose requests are in-flight when the old process is killed.
