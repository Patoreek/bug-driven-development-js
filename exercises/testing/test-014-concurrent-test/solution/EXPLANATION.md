# Solution: Fix the Flaky Rate Limiter Tests

## The Problem

The tests had three categories of bugs that made them flaky:

### 1. Shared State Between Tests

```typescript
// BUG: Global instance shared across all tests
const limiter = new RateLimiter(3, 1000);
```

The first test used all 3 calls, the second test depended on that state to assert `call() === false`, and the third test waited for a real timeout to reset. Running tests in isolation or in a different order would break assertions.

### 2. Real Timers

```typescript
// BUG: Real delay -- slow on CI, unreliable timing
await new Promise((resolve) => setTimeout(resolve, 1100));
expect(limiter.call()).toBe(true);
```

The `RateLimiter` uses `Date.now()` internally. With real timers, a CI machine under load might have 1100ms of wall-clock time pass without 1100ms of "Date.now() time" moving forward (or vice versa). The test becomes non-deterministic.

### 3. Timing-Dependent Assertions

```typescript
// BUG: Exact order depends on setTimeout precision
expect(order).toEqual(["start-a", "start-b", "end-b", "start-c", "end-a", "end-c"]);
```

The AsyncQueue test asserted exact execution order based on 50ms vs 100ms delays, but on slow machines the order could differ.

## The Fix

### Fresh instances per test

```typescript
let limiter: RateLimiter;

beforeEach(() => {
  vi.useFakeTimers();
  limiter = new RateLimiter(3, 1000); // Fresh instance
});

afterEach(() => {
  vi.useRealTimers();
});
```

### Fake timers for deterministic time control

```typescript
// Instead of: await new Promise(resolve => setTimeout(resolve, 1100));
vi.advanceTimersByTime(1000);
expect(limiter.call()).toBe(true); // Deterministic!
```

### Exact assertions instead of fuzzy ranges

```typescript
// Instead of: expect(timeLeft).toBeGreaterThan(200); expect(timeLeft).toBeLessThan(400);
limiter.call();
vi.advanceTimersByTime(200);
expect(limiter.getTimeUntilReset()).toBe(800); // Exactly 1000 - 200
```

### `advanceTimersByTimeAsync` for promise-based code

```typescript
// For AsyncQueue: advance timers AND flush microtasks
await vi.advanceTimersByTimeAsync(50);
expect(order).toEqual(["start-a", "start-b", "end-b", "start-c"]);
```

The key difference: `advanceTimersByTime` only advances timers synchronously, but `advanceTimersByTimeAsync` also flushes the promise microtask queue, which is essential when `setTimeout` callbacks resolve promises that trigger further work.

## Key Takeaways

1. **Test isolation**: Each test must create its own instances. Use `beforeEach` to set up fresh state.
2. **Fake timers**: Any code that depends on `Date.now()` or `setTimeout` should be tested with `vi.useFakeTimers()`.
3. **`advanceTimersByTimeAsync` vs `advanceTimersByTime`**: Use the async variant when your code chains promises off of timers (e.g., `setTimeout` inside an `async` function).
4. **Self-contained tests**: Each test should set up its own preconditions. Never depend on side effects from a previous test.

## Documentation

- [Vitest: Fake Timers](https://vitest.dev/api/vi.html#vi-usefaketimers)
- [Vitest: advanceTimersByTimeAsync](https://vitest.dev/api/vi.html#vi-advancetimersbytimeasync)
- [Testing Library: Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Interview Context

Flaky tests are one of the most common pain points in real-world codebases. Interviewers often ask "how would you debug a test that passes locally but fails in CI?" The answer almost always involves: checking for shared mutable state between tests, replacing real timers with fake timers, and making assertions deterministic rather than timing-dependent. Understanding `vi.useFakeTimers()` and `vi.advanceTimersByTimeAsync()` demonstrates practical testing expertise that goes beyond knowing the Vitest API surface.
