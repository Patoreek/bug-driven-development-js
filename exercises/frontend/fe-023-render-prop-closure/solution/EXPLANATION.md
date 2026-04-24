# Solution: Render Prop Closure Trap

## Why the Bug Happens

Two interrelated issues:

### 1. Stale Closure in handleLog

```tsx
// BUGGY
const handleLog = (entry: string) => {
  setLogEntries([...logEntries, entry]);  // `logEntries` is stale!
};
```

Each render creates a new `handleLog` that closes over that render's `logEntries`. If the user clicks "Log" when `logEntries` is `["A"]`, then the mouse moves (causing a re-render), and they click "Log" again, the second click's `handleLog` might still see `logEntries` as `[]` from an earlier render, overwriting the first entry.

### 2. Unstable Function Identity Defeats memo

The render prop `render={(pos) => <PositionLogger ... onLog={handleLog} />}` creates a new function on every render. Even if that weren't the case, `handleLog` itself is recreated on every render. Either one is enough to defeat `React.memo` on `PositionLogger`.

## The Fix

```tsx
// FIXED
const handleLog = useCallback((entry: string) => {
  setLogEntries((prev) => [...prev, entry]);  // functional update
}, []);
```

**Functional setState** (`prev => [...prev, entry]`) eliminates the dependency on the closed-over `logEntries` value. The callback always receives the latest state as `prev`.

**useCallback with `[]` deps** ensures `handleLog` has a stable identity across renders, allowing `React.memo` to skip re-renders when only `onLog` would have changed.

## Before / After

```diff
- const handleLog = (entry: string) => {
-   setLogEntries([...logEntries, entry]);
- };
+ const handleLog = useCallback((entry: string) => {
+   setLogEntries((prev) => [...prev, entry]);
+ }, []);
```

## Documentation

- [useCallback](https://react.dev/reference/react/useCallback)
- [Functional state updates](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
- [React.memo](https://react.dev/reference/react/memo)

## Common Variations

- Event handlers in `setInterval` or `setTimeout` closing over stale state
- Redux dispatch callbacks that read from closed-over selectors
- Debounced functions that capture state from the wrong render
- Any callback passed to a memoized child that depends on parent state

## Interview Context

This is a multi-concept question that tests:
- Understanding of JavaScript closures in React's render model
- Knowing when and why `React.memo` fails
- Functional setState as the idiomatic solution to stale closures
- `useCallback` usage and dependency array reasoning
