# Fix the Timer Test

**ID:** `test-008-timer-test`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `testing`, `vitest`, `fake-timers`, `debounce`  
**Prerequisites:** None

---

## The Scenario

Your team built a `debounce` utility and an `createAutoSave` function that saves user data at regular intervals. The test suite uses real `setTimeout` and `setInterval` calls, making the tests painfully slow (each auto-save test waits over a second) and occasionally flaky in CI. Some tests check values immediately without waiting for timers to fire, causing false negatives. Worst of all, the `setInterval` timers are never cleaned up, leaking into subsequent test files and causing seemingly unrelated failures.

## The Problem

The tests use real timers in three problematic ways:
1. **Checking too early** -- asserting right after calling a debounced function, before the timer fires
2. **Using real delays** -- `await new Promise(resolve => setTimeout(resolve, 1100))` to wait for real time to pass
3. **Not cleaning up** -- `setInterval` timers from `createAutoSave` are never stopped, leaking into other tests

## Your Task

1. Fix the test file at `src/__tests__/Debouncer.test.ts`
2. Do NOT modify the application code in `src/`
3. Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()` to control time
4. Restore real timers in `afterEach` and clean up any auto-save intervals
5. All tests should pass AND meaningfully verify timing behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/Debouncer.test.ts` | The test file with real timer issues |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/Debouncer.ts` | The correct debounce and auto-save implementation |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest Fake Timers](https://vitest.dev/api/vi.html#vi-usefaketimers) -- controlling time in tests
- [Testing setTimeout/setInterval](https://vitest.dev/guide/mocking.html#timers) -- fake timer patterns
- [Timer cleanup](https://vitest.dev/api/vi.html#vi-userealtimers) -- restoring real timers
