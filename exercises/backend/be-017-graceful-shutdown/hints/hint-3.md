# Hint 3 (Strong)

Use a "drain resolve" pattern. Create a variable `let drainResolve: (() => void) | null = null` in the closure.

In `handleRequest`, after decrementing `activeRequests`:
```ts
if (state.activeRequests === 0 && drainResolve) {
  drainResolve();
}
```

In `shutdown`:
```ts
state.isShuttingDown = true;
if (state.activeRequests > 0) {
  await new Promise<void>((resolve) => { drainResolve = resolve; });
}
for (const fn of state.cleanupFns) { await fn(); }
```

Don't forget the idempotency guard: `if (state.isShuttingDown) return;`
