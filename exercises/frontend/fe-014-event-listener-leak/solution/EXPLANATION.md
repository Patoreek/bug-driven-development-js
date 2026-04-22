# Solution: Event Listener Leak

## The Problem

The `useEffect` hook added a `resize` event listener but never cleaned it up:

```tsx
useEffect(() => {
  const handleResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  window.addEventListener("resize", handleResize);
  // No cleanup! The listener persists after unmount.
}, []);
```

Every time the component mounted, a new listener was attached. When the component unmounted, the old listener remained, causing:

1. **Memory leak** — handlers and their closures are never garbage collected
2. **State updates on unmounted components** — the handler calls `setSize` even after unmount
3. **Accumulated handlers** — multiple mounts stack up listeners, each firing on every resize

## The Fix

Return a cleanup function from `useEffect` that removes the event listener:

```tsx
useEffect(() => {
  const handleResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

## Key Takeaway

**Every `useEffect` that subscribes to something (event listeners, intervals, subscriptions, WebSocket connections) must return a cleanup function that unsubscribes.** This is one of the most common React bugs. The pattern is always:

```tsx
useEffect(() => {
  // Subscribe
  return () => {
    // Unsubscribe
  };
}, []);
```
