# Solution: Stale Closure Counter

## The Bug

The `handleIncrement` function captures the value of `count` at the time the component renders. When `setTimeout` fires, it uses that captured (stale) value:

```tsx
// BUG: `count` is captured by closure at render time
const handleIncrement = () => {
  setTimeout(() => {
    setCount(count + 1); // always uses the same `count` from this render
  }, DELAY_MS);
};
```

If you click 3 times rapidly, all 3 timeouts capture `count = 0` and all call `setCount(0 + 1)`, resulting in `count = 1` instead of `count = 3`.

## The Fix

Use the functional form of `setCount` which receives the latest state value as its argument:

```tsx
const handleIncrement = () => {
  setTimeout(() => {
    setCount((prev) => prev + 1); // always uses current state
  }, DELAY_MS);
};
```

Each timeout now increments from whatever the current value is, not the stale closure value.

## Key Takeaway

Whenever a state update depends on the previous state — especially inside async callbacks, timeouts, or intervals — always use the functional updater form (`setState(prev => ...)`) to avoid stale closure bugs.
