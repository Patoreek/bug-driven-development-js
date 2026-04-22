# Solution: Revalidation -- Stale Data After Mutation

## The Bug

The `getBookmarks` function uses a module-level cache (`cachedBookmarks`). Once populated on the first read, it never refreshes. Both `addBookmark` and `deleteBookmark` modify the underlying `bookmarks` array but leave `cachedBookmarks` untouched:

```ts
// getBookmarks returns stale data because cachedBookmarks is never set to null
export function getBookmarks() {
  if (!cachedBookmarks) {
    cachedBookmarks = [...bookmarks]; // only runs once
  }
  return cachedBookmarks; // returns stale snapshot forever
}
```

## The Fix

Invalidate the cache after every mutation:

```ts
function invalidateCache() {
  cachedBookmarks = null;
}

export async function addBookmark(url: string, title: string) {
  // ... add to bookmarks ...
  invalidateCache(); // <-- added
  return { success: true, bookmark };
}

export async function deleteBookmark(id: string) {
  // ... remove from bookmarks ...
  invalidateCache(); // <-- added
  return { success: true };
}
```

## Key Takeaway

Cache invalidation is one of the two hard problems in computer science. In real Next.js applications, you would use `revalidatePath()` or `revalidateTag()` after server actions to tell the framework to re-fetch cached data. The underlying principle is the same: every write operation must invalidate or update any cache that holds the affected data.

## Further Reading

- [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) -- invalidate specific routes
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) -- tag-based cache invalidation

## Interview Context

"How do you keep cached data consistent after mutations?" comes up frequently. The two main strategies are: (1) invalidate the cache so the next read fetches fresh data, or (2) optimistically update the cache in place. This exercise demonstrates strategy (1). Strategy (2) is covered in fs-006.
