# Hint 2 -- Medium

```typescript
beforeEach(() => {
  vi.useFakeTimers();
  limiter = new RateLimiter(3, 1000);
});

afterEach(() => {
  vi.useRealTimers();
});
```

With fake timers:
- `Date.now()` is controlled by Vitest, so `RateLimiter`'s timestamps are deterministic
- `vi.advanceTimersByTime(1000)` moves time forward exactly 1000ms
- No more `setTimeout` in tests -- just advance the clock

For `AsyncQueue` tests with promises, use `vi.advanceTimersByTimeAsync()` instead of `vi.advanceTimersByTime()` to properly flush promise microtasks between timer advances.

For the "reset after window" test, the pattern is:
1. Use all calls
2. `vi.advanceTimersByTime(windowMs)`
3. Calls are available again
