# Infinite Scroll Memory Leak: Unbounded State Accumulation

**ID:** `fs-015-infinite-scroll-memory`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `react`, `performance`, `memory`, `infinite-scroll`, `virtualization`  
**Prerequisites:** None

---

## The Scenario

Your social media feed uses infinite scroll to load posts as the user scrolls down. After about 30 minutes of scrolling, users report that the browser tab becomes extremely sluggish and eventually crashes. Chrome DevTools shows memory usage climbing to 2GB+. The problem: every page of data ever fetched is accumulated in state and never released, even though the user can only see a handful of posts at any given time.

## The Bug

The feed store accumulates all fetched pages in an unbounded array. After loading 100 pages of 20 items each, there are 2,000 items in state, all being rendered (even though only ~10 are visible). The store has no concept of a "window" — it only knows how to append new data, never how to release old data.

Key issues:
1. **Unbounded state growth:** `loadMore()` always appends, never trims
2. **No window management:** No way to know which pages are near the viewport
3. **All pages always in memory:** `getItems()` returns everything ever fetched
4. **No cleanup:** No mechanism to drop pages far from the current scroll position

## Your Task

1. Examine `src/feedStore.ts` and `src/useInfiniteScroll.ts`
2. Implement a sliding window that keeps at most `maxPages` pages in state
3. When new pages are loaded beyond the window, drop the oldest pages
4. Track the current window range (startPage, endPage)
5. Provide `getWindowedItems()` that returns only the items in the current window
6. Implement `scrollToPage()` that recenters the window around a given page

## Files to Modify

| File | Description |
|------|-------------|
| `src/feedStore.ts` | Data store that accumulates all pages without limit |
| `src/useInfiniteScroll.ts` | Hook that drives the infinite scroll behavior |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Virtualization](https://web.dev/articles/virtualize-long-lists-react-window) -- rendering only visible items
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) -- detecting scroll position
- [React Performance](https://react.dev/reference/react/useMemo) -- avoiding unnecessary re-renders
