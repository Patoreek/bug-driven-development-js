# Solution: Infinite Scroll Memory Leak

## The Bug

The feed store accumulated every page of data in an unbounded `Map`. After the user scrolled through 100 pages (2,000 items), all items remained in memory and in the React component tree. This caused:

1. **Memory growth:** Each page adds ~20 items. 100 pages = 2,000 DOM nodes
2. **Re-render slowdown:** Every new page triggered a re-render of ALL 2,000+ items
3. **Eventual crash:** Browsers have per-tab memory limits (~2-4GB)

The `maxPages` parameter was accepted but never enforced.

## The Fix

### Sliding Window in the Store

```typescript
// Before: No cleanup
function loadPage(page: number): void {
  const data = fetchPage(page);
  pages.set(page, data);
  // Pages accumulate forever
}

// After: Enforce window after each load
function loadPage(page: number): void {
  const data = fetchPage(page);
  pages.set(page, data);
  enforceWindow(); // Remove excess pages
}

function enforceWindow(): void {
  if (pages.size <= maxPages) return;
  const sorted = [...pages.keys()].sort((a, b) => a - b);
  while (sorted.length > maxPages) {
    pages.delete(sorted.shift()!);
  }
}
```

### scrollToPage Implementation

```typescript
function scrollToPage(targetPage: number): void {
  const halfWindow = Math.floor(maxPages / 2);
  const windowStart = Math.max(0, targetPage - halfWindow);
  const windowEnd = windowStart + maxPages - 1;

  // Load missing pages
  for (let p = windowStart; p <= windowEnd; p++) {
    if (!pages.has(p)) pages.set(p, fetchPage(p));
  }

  // Remove pages outside window
  for (const pageNum of [...pages.keys()]) {
    if (pageNum < windowStart || pageNum > windowEnd) {
      pages.delete(pageNum);
    }
  }
}
```

### Controller Uses Windowed Data

```typescript
// Before
items: store.getItems(), // All items ever loaded

// After
items: store.getWindowedItems(), // Only items in current window
```

## Key Takeaway

Infinite scroll must be implemented with a **sliding window** pattern. Keep only N pages in memory at any time, where N is enough to provide smooth scrolling without visible loading gaps. For production apps, combine this with DOM virtualization (react-window or react-virtuoso) to also limit the number of rendered DOM nodes.

## Related Documentation

- [react-window](https://github.com/bvaughn/react-window) -- virtualized list library
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Chrome Memory Profiling](https://developer.chrome.com/docs/devtools/memory-problems)

## Interview Context

Infinite scroll memory management is a classic senior frontend question. Interviewers expect:
- Recognition that unbounded state growth is the root cause
- Knowledge of sliding window / data windowing patterns
- Understanding the difference between data windowing and DOM virtualization
- Awareness that `scrollToPage` needs to both load new data and release old data
- Discussion of tradeoffs: window size vs. re-fetch cost
