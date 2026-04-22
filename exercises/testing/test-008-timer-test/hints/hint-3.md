# Hint 3 (Strong)

Here's the pattern for the debounce test:

```ts
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
  expect(fn).not.toHaveBeenCalled();  // Not yet

  vi.advanceTimersByTime(300);         // Move time forward
  expect(fn).toHaveBeenCalledWith("hello");
});
```

For auto-save:
```ts
it("should auto-save at intervals", () => {
  const saveFn = vi.fn();
  const autoSave = createAutoSave(saveFn, 1000);
  autoSave.update("draft 1");

  vi.advanceTimersByTime(1000);
  expect(saveFn).toHaveBeenCalledWith("draft 1");

  autoSave.stop();  // Clean up the interval!
});
```
