# Hint 3 (Strong)

Create an `invalidateCache` helper and call it at the end of both `addBookmark` and `deleteBookmark`:

```ts
function invalidateCache() {
  cachedBookmarks = null;
}
```

Add `invalidateCache()` after `bookmarks.push(bookmark)` in `addBookmark` and after `bookmarks.splice(index, 1)` in `deleteBookmark`.
