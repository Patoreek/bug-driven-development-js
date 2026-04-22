# Event Listener Leak: The Cleanup That Never Happened

**ID:** `fe-014-event-listener-leak`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `useEffect`, `memory-leak`, `event-listeners`, `cleanup`  
**Prerequisites:** None

---

## The Scenario

Your team built a responsive component that displays the current window dimensions and adjusts its layout accordingly. After deploying, the performance monitoring tool flags a memory leak — every time a user navigates away from the page with this component and comes back, the app gets slightly slower. A memory profiler shows an ever-growing number of "resize" event listeners attached to the window object.

## The Bug

The `useEffect` hook adds a `resize` event listener to the window but never returns a cleanup function. Each time the component mounts, a new listener is added. When the component unmounts, the old listener remains active, continuing to call `setState` on an unmounted component and consuming memory.

## Your Task

1. Fix the `useEffect` in `WindowSize.tsx` to properly clean up the event listener on unmount
2. Ensure all tests pass
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/WindowSize.tsx` | Component with a leaking resize event listener |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) — Why cleanup functions matter
- [useEffect Cleanup](https://react.dev/reference/react/useEffect#parameters) — The return value of useEffect
