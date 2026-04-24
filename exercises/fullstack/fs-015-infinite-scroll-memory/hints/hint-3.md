# Hint 3 (Strong)

Add this function inside `createFeedStore`:

```typescript
function enforceWindow(): void {
  if (pages.size <= maxPages) return;
  const sorted = [...pages.keys()].sort((a, b) => a - b);
  while (sorted.length > maxPages) {
    pages.delete(sorted.shift()!);
  }
}
```

Call `enforceWindow()` at the end of `loadPage()`.

For `scrollToPage`:

```typescript
function scrollToPage(targetPage: number): void {
  const halfWindow = Math.floor(maxPages / 2);
  const start = Math.max(0, targetPage - halfWindow);
  const end = start + maxPages - 1;

  for (let p = start; p <= end; p++) {
    if (!pages.has(p)) pages.set(p, fetchPage(p));
  }
  for (const num of [...pages.keys()]) {
    if (num < start || num > end) pages.delete(num);
  }
}
```

In the controller, change `store.getItems()` to `store.getWindowedItems()`.
