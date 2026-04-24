# Hint 2 (Medium)

You need an `enforceWindow()` function that runs after every `loadPage()` call:

1. If `pages.size > maxPages`, sort the page numbers
2. Delete the oldest pages until `pages.size <= maxPages`

For `scrollToPage()`:
1. Calculate a window centered on the target page: `[target - halfWindow, target + halfWindow]`
2. Load any missing pages in that range
3. Delete any pages outside that range

The controller's `getState()` should use `store.getWindowedItems()` instead of `store.getItems()`.
