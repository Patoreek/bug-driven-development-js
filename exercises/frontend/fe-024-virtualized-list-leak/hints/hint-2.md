# Hint 2 (Medium)

Three fixes needed:

1. **Memory leak:** Return a cleanup function from the Row's `useEffect` that removes the `mouseenter` listener.
2. **Passive listener:** Pass `{ passive: true }` as the third argument to the scroll `addEventListener`.
3. **Layout thrashing:** In `measureRows`, the loop reads `offsetHeight` then writes `style.minHeight` on each iteration. Separate these into two passes: first loop reads all heights into an array, second loop writes all styles.
