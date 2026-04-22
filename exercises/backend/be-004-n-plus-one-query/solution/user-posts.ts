export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
}

export interface UserWithPostCount {
  id: string;
  name: string;
  postCount: number;
}

export interface Database {
  query: (operation: string, params?: unknown[]) => Promise<unknown[]>;
}

export async function getUsersWithPostCounts(
  db: Database
): Promise<UserWithPostCount[]> {
  // Query 1: Fetch all users
  const users = (await db.query("SELECT_ALL_USERS")) as User[];

  if (users.length === 0) {
    return [];
  }

  // Query 2: Fetch post counts for ALL users in a single batched query
  const userIds = users.map((u) => u.id);
  const postCounts = (await db.query("SELECT_POST_COUNTS_BY_USERS", [
    userIds,
  ])) as Array<{ userId: string; postCount: number }>;

  // Build a lookup map for O(1) access
  const countMap = new Map<string, number>();
  for (const row of postCounts) {
    countMap.set(row.userId, row.postCount);
  }

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    postCount: countMap.get(user.id) ?? 0,
  }));
}
