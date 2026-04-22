# Explanation: Timer Tests

## Why the Tests Were Flawed

The original tests tried to test time-dependent code (`setTimeout`, `setInterval`) using real timers. This causes three distinct problems:

1. **Race conditions** -- Assertions that run immediately after scheduling a timer will always fail because the timer hasn't fired yet
2. **Slow tests** -- Waiting for real time to pass (`setTimeout(resolve, 1100)`) makes the suite agonizingly slow
3. **Timer leaks** -- `setInterval` timers that aren't cleaned up continue firing in subsequent test files, causing mysterious failures

## What Was Wrong

```ts
// BEFORE: Real timers
it("should call the function after the delay", async () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 300);
  debounced("hello");
  expect(fn).toHaveBeenCalledWith("hello"); // FAILS: timer hasn't fired yet
});

it("should auto-save at intervals", async () => {
  const saveFn = vi.fn();
  const autoSave = createAutoSave(saveFn, 1000);
  autoSave.update("draft 1");
  await new Promise(resolve => setTimeout(resolve, 1100)); // Waits 1.1 real seconds!
  expect(saveFn).toHaveBeenCalledWith("draft 1");
  // Timer never stopped -- leaks into other tests
});
```

## The Fix

```ts
// AFTER: Fake timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("should call the function after the delay", () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 300);
  debounced("hello");
  expect(fn).not.toHaveBeenCalled();    // Verify it hasn't fired yet

  vi.advanceTimersByTime(300);           // Instantly advance 300ms
  expect(fn).toHaveBeenCalledWith("hello"); // Now it has fired
});

it("should auto-save at intervals", () => {
  const saveFn = vi.fn();
  const autoSave = createAutoSave(saveFn, 1000);
  autoSave.update("draft 1");

  vi.advanceTimersByTime(1000);          // Instant -- no real waiting
  expect(saveFn).toHaveBeenCalledWith("draft 1");

  autoSave.stop();                       // Clean up the interval
});
```

Key techniques:
- **`vi.useFakeTimers()`** replaces `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval` with controllable fakes
- **`vi.advanceTimersByTime(ms)`** moves the fake clock forward, triggering any timers that would have fired
- **`vi.useRealTimers()`** restores the original timer functions
- **Always clean up intervals** -- call `stop()` or `clearInterval()` to prevent leaks

## Fake Timer API Summary

| Method | Purpose |
|--------|---------|
| `vi.useFakeTimers()` | Install fake timers |
| `vi.useRealTimers()` | Restore real timers |
| `vi.advanceTimersByTime(ms)` | Move clock forward by N ms |
| `vi.advanceTimersToNextTimer()` | Jump to next scheduled timer |
| `vi.runAllTimers()` | Fire all pending timers |
| `vi.getTimerCount()` | How many timers are pending |

## Interview Context

Timer testing comes up in senior frontend interviews:
- "How do you test debounce/throttle functions?"
- "Why are tests that use real `setTimeout` flaky?"
- "How do you prevent timer leaks between tests?"

The key insight: **never wait for real time in tests**. Use fake timers to make time-dependent code deterministic and fast.
