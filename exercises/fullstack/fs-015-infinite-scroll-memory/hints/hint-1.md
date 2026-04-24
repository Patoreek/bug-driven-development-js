# Hint 1 (Mild)

Look at `createFeedStore` — the `maxPages` parameter is accepted but never used. After calling `loadPage()` 100 times, how many pages are in the `pages` Map? What would happen if you limited it?

Also look at `getWindowedItems()` — it just calls `getItems()` which returns everything. What should it return instead?
