# Hint 2 (Medium)

There's a `mutate` function already defined in the file. When called with just a `postId`, it deletes the cache entry for that post's comments. When called with data, it updates the cache directly. You need to call this after the database write in `addComment`.
