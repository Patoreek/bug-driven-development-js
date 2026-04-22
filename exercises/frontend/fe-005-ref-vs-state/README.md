# Ref vs State for Interval Timer

**ID:** `fe-005-ref-vs-state`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `hooks`, `useRef`, `useState`, `setInterval`  
**Prerequisites:** None

---

## The Scenario

You're building a stopwatch component for a fitness app. The timer starts and displays elapsed seconds. But when users click "Stop", the timer keeps running. Sometimes clicking "Stop" works, sometimes it doesn't. The behavior is inconsistent and hard to reproduce, which makes it a tricky bug to track down.

## The Bug

The interval ID is stored in `useState`, which causes the stop handler to reference a stale value. When the component re-renders (which happens every second as the elapsed time updates), the `handleStop` function captures the interval ID from the previous render's closure, but the actual interval may have been set with a different ID.

## Your Task

1. Examine `src/Stopwatch.tsx` and identify why the stop button is unreliable
2. Fix the interval ID storage so stop always works correctly
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Stopwatch.tsx` | Stopwatch component with start/stop/reset |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useRef](https://react.dev/reference/react/useRef) — mutable references that persist across renders
- [useState vs useRef](https://react.dev/learn/referencing-values-with-refs#differences-between-refs-and-state) — when to use which
