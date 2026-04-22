# Hint 3 (Strong)

Replace the loop with a batched query and a Map lookup:

```ts
const users = await db.query("SELECT_ALL_USERS") as User[];
if (users.length === 0) return [];

const userIds = users.map(u => u.id);
const postCounts = await db.query("SELECT_POST_COUNTS_BY_USERS", [userIds])
  as Array<{ userId: string; postCount: number }>;

const countMap = new Map<string, number>();
for (const row of postCounts) {
  countMap.set(row.userId, row.postCount);
}

return users.map(user => ({
  id: user.id,
  name: user.name,
  postCount: countMap.get(user.id) ?? 0,
}));
```
