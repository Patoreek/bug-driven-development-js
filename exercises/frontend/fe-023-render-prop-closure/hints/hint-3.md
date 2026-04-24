# Hint 3 (Strong)

```tsx
const handleLog = useCallback((entry: string) => {
  setLogEntries((prev) => [...prev, entry]);  // functional update, no stale closure
}, []);
```

This gives `handleLog` a stable identity (never recreated) and always sees the latest state via the `prev` argument. The `PositionLogger` memo will now work for the `onLog` prop (though the inline render prop still causes re-renders from position changes, which is expected behavior).
