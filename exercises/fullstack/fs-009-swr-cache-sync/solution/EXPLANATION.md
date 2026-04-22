# Solution: SWR Cache Sync

## The Bug

The `addComment` function successfully writes to the database but never invalidates the SWR cache:

```ts
db.push(comment);
// Missing: mutate(postId) or mutate(postId, updatedData)
return comment;
```

The `getComments` function checks the cache first. Since the cache was populated before the new comment was added, it returns the stale list. The new comment is in the database but invisible to the UI.

## The Fix

Call `mutate(postId)` after the database write to invalidate the cache:

```ts
db.push(comment);
mutate(postId);  // Invalidate cache -- next read will fetch fresh data
return comment;
```

This deletes the cached entry for this post's comments, so the next call to `getComments` will hit the "database" and get the full list including the new comment.

Alternatively, you could optimistically update the cache with the new data:
```ts
const currentComments = await getComments(postId);
mutate(postId, [...currentComments, comment]);
```

## Key Takeaway

In SWR (and similar libraries like TanStack Query), every mutation needs to be followed by cache invalidation or update. Use `mutate()` with no data argument to invalidate (force refetch), or pass updated data for an immediate cache update. Without this step, the UI will show stale data until the cache expires naturally.
