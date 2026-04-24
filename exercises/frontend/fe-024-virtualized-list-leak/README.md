# Virtualized List: Memory Leaks and Layout Thrashing

**ID:** `fe-024-virtualized-list-leak`  
**Difficulty:** ★★★★★  
**Estimated Time:** 35 minutes  
**Tags:** `react`, `virtualization`, `memory-leak`, `performance`, `dom`, `passive-events`  
**Prerequisites:** None

---

## The Scenario

Your team built a custom virtualized list to render 1,000+ items efficiently. It only renders visible rows, but users report the page becomes sluggish after scrolling for a while: memory usage climbs, scroll performance degrades, and mobile users experience janky touch scrolling. Profiling reveals three distinct problems in the component.

## The Bug

Three performance/correctness issues:

1. **Memory leak:** The `Row` component attaches a `mouseenter` event listener in a `useEffect` but **never removes it**. As rows scroll in and out of view, DOM nodes are removed but their listeners keep references alive, preventing garbage collection.

2. **Non-passive scroll listener:** The scroll handler is registered without `{ passive: true }`, which blocks the browser's scroll optimization pipeline. On touch devices, this causes visible jank.

3. **Layout thrashing:** The `measureRows` function reads `offsetHeight` (forcing layout) and then writes `style.minHeight` (invalidating layout) **in the same loop**. Each iteration triggers a forced reflow, turning an O(n) operation into O(n^2) layout calculations.

## Your Task

1. Fix the `Row` component to clean up its event listener on unmount
2. Add `{ passive: true }` to the scroll listener
3. Batch all DOM reads before all DOM writes in `measureRows`
4. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/VirtualList.tsx` | Virtualized list with three performance bugs |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Event listener cleanup](https://react.dev/reference/react/useEffect#connecting-to-an-external-system) -- useEffect cleanup functions
- [Passive event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) -- scroll performance
- [Layout thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) -- DOM read/write batching
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) -- frame-aligned DOM updates
