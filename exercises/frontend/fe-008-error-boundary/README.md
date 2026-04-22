# Error Boundary

**ID:** `fe-008-error-boundary`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `error-boundary`, `error-handling`, `class-component`  
**Prerequisites:** None

---

## The Scenario

Your team's analytics dashboard has several independent widgets. One widget occasionally receives malformed data from an API and throws during render. When this happens, the entire dashboard goes blank — users lose access to all widgets, not just the broken one. The product manager wants a graceful fallback: if one widget crashes, the others should keep working.

## The Bug

There is no error boundary wrapping the widgets. When one component throws during rendering, React unmounts the entire component tree and shows nothing. The app needs an error boundary to catch render errors and display a fallback UI instead of crashing everything.

## Your Task

1. Examine `src/Dashboard.tsx` and understand why one failing widget takes down the entire dashboard
2. Implement an error boundary class component and wrap the problematic widget
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Dashboard.tsx` | Dashboard with widgets, one of which can throw |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) — catching render errors
- [getDerivedStateFromError](https://react.dev/reference/react/Component#static-getderivedstatefromrerror) — updating state on error
- [componentDidCatch](https://react.dev/reference/react/Component#componentdidcatch) — logging errors
