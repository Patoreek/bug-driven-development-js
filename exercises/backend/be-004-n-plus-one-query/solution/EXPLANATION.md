# Explanation: N+1 Query Problem

## The Bug

The original code made 1 + N database queries:

```ts
const users = await db.query("SELECT_ALL_USERS");         // 1 query
for (const user of users) {
  const posts = await db.query("SELECT_POSTS_BY_USER", [user.id]); // N queries
}
```

For 500 users, that's 501 queries. Each query has network latency and database overhead, so the page load time scales linearly with the number of users.

## The Fix

Replace the per-user loop with a single batched query:

```ts
const users = await db.query("SELECT_ALL_USERS");              // 1 query
const userIds = users.map(u => u.id);
const postCounts = await db.query("SELECT_POST_COUNTS_BY_USERS", [userIds]); // 1 query
```

Then use a `Map` to efficiently look up each user's post count:

```ts
const countMap = new Map(postCounts.map(row => [row.userId, row.postCount]));
return users.map(user => ({
  ...user,
  postCount: countMap.get(user.id) ?? 0,
}));
```

In real SQL, this would look like:
```sql
SELECT user_id, COUNT(*) as post_count
FROM posts
WHERE user_id IN ($1, $2, $3, ...)
GROUP BY user_id
```

## Key Takeaway

The N+1 problem is one of the most common performance issues in database-backed applications. Always look for loops that make individual database queries. The fix is to batch queries using `IN` clauses, `JOIN`s, or ORM-specific features like Prisma's `include` or DataLoader patterns.
