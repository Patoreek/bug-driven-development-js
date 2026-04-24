# Render Prop Closure Trap

**ID:** `fe-023-render-prop-closure`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `react`, `render-props`, `closures`, `memoization`, `performance`  
**Prerequisites:** None

---

## The Scenario

Your team has a `MouseTracker` component that uses the render prop pattern to share mouse position data. A `PositionLogger` child component is wrapped in `React.memo` for performance. Users report two issues: (1) clicking the "Log Position" button multiple times only keeps the most recent entry, losing all previous ones, and (2) the memoized `PositionLogger` re-renders on every mouse move even when it shouldn't (its `memo` is completely ineffective).

## The Bug

The render prop creates an inline function on every render, which means `PositionLogger` always receives new props (defeating `memo`). Worse, the `onLog` callback closes over the `logEntries` array from the render in which it was created. When the user clicks "Log" multiple times, each click uses a stale snapshot of `logEntries`, overwriting previous entries instead of accumulating them.

## Your Task

1. Fix the `handleLog` callback so it doesn't close over stale state
2. Stabilize the callback reference using the appropriate React hook
3. Ensure `PositionLogger`'s memo can actually work by giving it stable prop references
4. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/MouseTracker.tsx` | Mouse tracker with render prop, logger, and app |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useCallback](https://react.dev/reference/react/useCallback) -- memoizing function references
- [Functional setState](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state) -- avoiding stale closures in state updates
- [React.memo](https://react.dev/reference/react/memo) -- when and why it skips re-renders
- [Render Props](https://react.dev/learn/render-and-commit) -- pattern and its pitfalls
