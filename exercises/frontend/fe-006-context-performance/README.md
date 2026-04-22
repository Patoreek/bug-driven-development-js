# Context Performance

**ID:** `fe-006-context-performance`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 25 minutes  
**Tags:** `react`, `context`, `performance`, `useMemo`, `optimization`  
**Prerequisites:** None

---

## The Scenario

Your team built an app-wide context that holds user info, theme preferences, and notification count. Users report that clicking "Mark all read" on notifications causes the entire page to visibly re-render — even the header and sidebar which only use the theme and user data. Performance profiling shows every context consumer re-renders when any value in the context changes.

## The Bug

A single context provides an object with all app state. The context value object is recreated on every render (new reference), causing all consumers to re-render whenever any piece of state changes — even consumers that only read values that didn't change.

## Your Task

1. Examine `src/AppContext.tsx` and identify why all consumers re-render on any state change
2. Memoize the context value so consumers only re-render when their specific data changes
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/AppContext.tsx` | Context provider and consumer components |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React Context](https://react.dev/reference/react/useContext) — context API reference
- [Optimizing context](https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions) — memoizing context values
