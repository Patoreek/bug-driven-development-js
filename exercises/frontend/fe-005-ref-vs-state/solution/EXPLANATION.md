# Solution: Ref vs State for Interval Timer

## The Bug

The interval ID is stored with `useState`:

```tsx
const [intervalId, setIntervalId] = useState<number | null>(null);
```

This causes two problems:

1. **Stale closure**: `handleStop` captures `intervalId` from when `useCallback` was last created. If the interval ID was set after the callback was memoized, `handleStop` tries to clear a stale (or null) ID.

2. **Async state updates**: `setIntervalId(id)` is asynchronous — the new value isn't available until the next render. But `clearInterval` needs the value immediately.

## The Fix

Use `useRef` instead of `useState` for the interval ID:

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

Refs are mutable and always current — `intervalRef.current` always holds the latest value, regardless of closures or render timing:

```tsx
// Start
intervalRef.current = setInterval(() => { ... }, 1000);

// Stop — always reads the current value
clearInterval(intervalRef.current);
intervalRef.current = null;
```

## Key Takeaway

Use `useState` for values that should trigger re-renders when changed (UI data). Use `useRef` for mutable values that need to persist across renders but should NOT trigger re-renders (interval IDs, DOM references, previous values, etc.).
