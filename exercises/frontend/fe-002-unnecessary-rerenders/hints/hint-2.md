# Hint 2 (Medium)

Even with `React.memo`, if the `onToggle` function is recreated on every render, `memo` will see a new prop reference and re-render anyway. `useCallback` stabilizes function references. Similarly, `Array.filter` returns a new array every time, even with the same inputs.
