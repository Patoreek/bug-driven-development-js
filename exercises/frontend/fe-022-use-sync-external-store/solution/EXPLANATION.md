# Solution: External Store Tearing

## Why the Bug Happens

The classic `useEffect + useState` pattern for subscribing to external stores has a fundamental timing issue in React's concurrent mode:

```tsx
// BUGGY
const [theme, setTheme] = useState(themeStore.getTheme());  // snapshot at render time

useEffect(() => {
  const unsubscribe = themeStore.subscribe(() => {
    setTheme(themeStore.getTheme());  // runs AFTER render
  });
  setTheme(themeStore.getTheme());  // sync attempt, still after render
  return unsubscribe;
}, []);
```

**Problem 1 — Tearing:** In concurrent mode, React can pause a render and resume later. Between pause and resume, the external store value can change. One component renders with value A, another with value B -- they show inconsistent (torn) UI.

**Problem 2 — Mount race:** Between `useState(initialValue)` and `useEffect` firing, there's a gap. If the store changes in that gap (e.g., another component updates it during the same render pass), the first render shows a stale value.

## The Fix

```tsx
// FIXED
const theme = useSyncExternalStore(
  themeStore.subscribe,   // how to subscribe
  themeStore.getTheme,    // how to get current value (during render)
  themeStore.getTheme     // SSR fallback
);
```

`useSyncExternalStore` reads the snapshot **during render** (not after), and forces a synchronous re-render if the value changed between renders. This guarantees consistency across all components reading the same store.

## Key Takeaway

Any time you need a React component to subscribe to data that lives **outside React** (vanilla JS stores, browser APIs like `matchMedia`, `localStorage`, WebSocket connections), use `useSyncExternalStore`. The `useEffect + useState` pattern is no longer safe in concurrent React.

## Documentation

- [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [Tearing and external stores discussion](https://github.com/reactwg/react-18/discussions/69)

## Common Variations

- Subscribing to `window.matchMedia` for responsive layouts
- Reading from `localStorage` / `sessionStorage`
- Redux-like vanilla stores
- WebSocket or EventSource connections
- Browser `navigator.onLine` status

## Interview Context

This question tests deep React knowledge:
- Understanding of concurrent rendering and why it broke old patterns
- Knowing that `useEffect` runs *after* commit, not during render
- Familiarity with `useSyncExternalStore` and when it's needed vs `useState`
- Understanding tearing as a concept in UI consistency
