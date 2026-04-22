# Hint 3 (Strong)

Replace `useState` for the interval ID with `useRef`:

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

Then use `intervalRef.current` everywhere instead of `intervalId`. Assign with `intervalRef.current = id` (no setter needed), and clear with `clearInterval(intervalRef.current)`. Unlike state, `ref.current` always holds the latest value.
