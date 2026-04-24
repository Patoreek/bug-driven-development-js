# Fix the Flaky Rate Limiter Tests

**ID:** `test-014-concurrent-test`
**Difficulty:** ★★★★★
**Estimated Time:** 30 minutes
**Tags:** `testing`, `vitest`, `fake-timers`, `async`, `flaky-tests`, `shared-state`
**Prerequisites:** None

---

## The Scenario

Your team has a `RateLimiter` class (limits function calls per time window) and an `AsyncQueue` class (limits concurrent async operations). The tests pass on your fast MacBook Pro but fail on CI about 30% of the time. Some tests pass individually but fail when the full suite runs. The tests use real `setTimeout` with hardcoded delays and share mutable instances between tests. Your tech lead has asked you to make the tests deterministic so CI stops being red.

## The Problem

The tests have three categories of bugs:

1. **Real timers**: Tests use `setTimeout` to wait for time-based behavior, but real time is unreliable -- CI machines are slower, and `setTimeout(1100)` might not actually wait 1100ms of "rate limiter time"
2. **Shared state**: A single `RateLimiter` and `AsyncQueue` instance is shared across all tests. The first test uses up the rate limit, the second test depends on that state, and the third test waits for a real-time reset
3. **Timing-dependent assertions**: The AsyncQueue test asserts exact execution order based on `setTimeout` durations, but on slow machines the 50ms and 100ms tasks might finish in different order
4. **Retry-based testing**: The payment failure test retries up to 50 times hoping for a specific timing condition

## Your Task

1. Fix the test file at `src/__tests__/RateLimiter.test.ts`
2. Do NOT modify the application code in `src/RateLimiter.ts`
3. Use `vi.useFakeTimers()` to control time deterministically
4. Create fresh instances in `beforeEach` so no state leaks between tests
5. Use `vi.advanceTimersByTime()` and `vi.advanceTimersByTimeAsync()` instead of real delays
6. Make each test self-contained -- it should pass regardless of test execution order

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/RateLimiter.test.ts` | Tests with real timers, shared state, flaky assertions |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/RateLimiter.ts` | The correct RateLimiter and AsyncQueue classes |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest: Fake Timers](https://vitest.dev/api/vi.html#vi-usefaketimers) -- controlling time in tests
- [Vitest: advanceTimersByTimeAsync](https://vitest.dev/api/vi.html#vi-advancetimersbytimeasync) -- advancing timers with async support
- [Testing Asynchronous Code](https://vitest.dev/guide/testing-types.html) -- patterns for async tests
