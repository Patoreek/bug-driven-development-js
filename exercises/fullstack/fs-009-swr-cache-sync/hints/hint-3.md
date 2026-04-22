# Hint 3 (Strong)

Add one line after `db.push(comment)` in the `addComment` function:

```ts
mutate(postId);
```

This invalidates the cache for that post's comments. The next call to `getComments(postId)` will bypass the stale cache and fetch fresh data from the database, which now includes the new comment.
