# Hint 2 (Medium)

Two fixes are needed:

1. **Stale closure:** Instead of `setLogEntries([...logEntries, entry])`, use the functional form: `setLogEntries(prev => [...prev, entry])`. This way you don't depend on the closed-over `logEntries` at all.

2. **Unstable reference:** Wrap `handleLog` in `useCallback` with an empty dependency array (since the functional setState has no external dependencies). This gives `PositionLogger` a stable `onLog` prop.
