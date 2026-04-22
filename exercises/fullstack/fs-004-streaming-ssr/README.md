# Streaming SSR: Blocking Fetches Prevent Progressive Rendering

**ID:** `fs-004-streaming-ssr`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `streaming`, `suspense`, `ssr`, `performance`  
**Prerequisites:** None

---

## The Scenario

You are building an analytics dashboard for a SaaS product. The page has three sections: a summary panel (fast, ~50ms), a weekly chart (slow, ~2s), and an activity feed (slowest, ~3s). Users are complaining that the page takes over 5 seconds to show anything -- they stare at a blank screen while all three data sources load sequentially.

## The Bug

The `Dashboard` component awaits all three data fetches sequentially at the top level. Because there are no Suspense boundaries, the entire page is blocked until every fetch resolves (~5 seconds total). The fast summary data is ready in 50ms but cannot be displayed until the slow chart and activity data also finish loading.

## Your Task

1. Identify which fetches are fast enough to await directly and which are too slow
2. Move slow fetches into separate async wrapper components
3. Wrap slow sections in `<Suspense>` boundaries with `<LoadingSkeleton>` fallbacks
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Dashboard.tsx` | Dashboard component with sequential blocking fetches |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Streaming with Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) -- progressive rendering in Next.js
- [React Suspense](https://react.dev/reference/react/Suspense) -- showing fallbacks for async content
- [Async Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) -- data fetching patterns
