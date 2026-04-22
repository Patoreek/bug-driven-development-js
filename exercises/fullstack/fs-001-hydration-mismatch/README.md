# Hydration Mismatch: Server vs Client Rendering

**ID:** `fs-001-hydration-mismatch`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `ssr`, `hydration`, `useEffect`, `react`  
**Prerequisites:** None

---

## The Scenario

Your team shipped a greeting banner component for a SaaS dashboard. It shows a personalized message based on the time of day ("Good morning", "Good afternoon", "Good evening") and the user's viewport width to decide between a compact or full layout. QA reports that in production, React throws hydration warnings in the console and sometimes the greeting flickers to a different message after the page loads. The component works fine in development with Fast Refresh, but the production build is broken.

## The Bug

The component calls `new Date().getHours()` and reads `window.innerWidth` directly during render. Since the server and client execute at different times (and the server has no `window`), the server-rendered HTML doesn't match what the client produces on hydration. This causes React hydration mismatches, console warnings, and visible UI flicker.

## Your Task

1. Examine `src/Greeting.tsx` and identify the values that differ between server and client
2. Fix the component so it renders safely on the server and hydrates without mismatch
3. Use `useEffect` and `useState` for client-only values
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Greeting.tsx` | Greeting banner with hydration mismatch bugs |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot) -- how server HTML is made interactive
- [useEffect](https://react.dev/reference/react/useEffect) -- running code only on the client
- [Next.js SSR](https://nextjs.org/docs/app/building-your-application/rendering/server-components) -- server vs client rendering
