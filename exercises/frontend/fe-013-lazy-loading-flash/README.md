# Lazy Loading Flash: The Missing Suspense Boundary

**ID:** `fe-013-lazy-loading-flash`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `react`, `lazy-loading`, `suspense`, `code-splitting`  
**Prerequisites:** None

---

## The Scenario

The app uses `React.lazy` to code-split a heavy Dashboard component. In development, you see a brief white flash on navigation. In production, some users on slower connections see nothing for several seconds before the dashboard appears. The app doesn't crash, but the user experience is jarring — there's no loading indicator and the console shows a cryptic error about a missing Suspense boundary.

## The Bug

The lazy-loaded component is used without a `<Suspense>` boundary wrapping it. React requires any component loaded via `React.lazy` to be wrapped in a `<Suspense>` component that provides a fallback UI while the lazy component loads. Without it, React throws an error in some environments or shows nothing during loading.

## Your Task

1. Add a proper `<Suspense>` boundary around the lazy-loaded component with an appropriate loading fallback
2. Ensure the app shows a loading indicator while the component loads
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/App.tsx` | Main app component that uses lazy-loaded Dashboard |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React.lazy](https://react.dev/reference/react/lazy) — Lazy loading components
- [Suspense](https://react.dev/reference/react/Suspense) — Showing fallback UI during loading
