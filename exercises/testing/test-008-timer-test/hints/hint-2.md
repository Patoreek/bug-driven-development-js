# Hint 2 (Medium)

Use `vi.useFakeTimers()` in `beforeEach` to replace `setTimeout` and `setInterval` with fakes. Then use `vi.advanceTimersByTime(ms)` to move time forward instantly. After each test, call `vi.useRealTimers()` in `afterEach` to restore normal timer behavior. For the auto-save tests, also call `autoSave.stop()` to clean up the interval.
