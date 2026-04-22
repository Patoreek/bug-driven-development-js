// BUG: This module has an N+1 query problem — it makes one query per user
// to fetch their posts, instead of batching into a single query.

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

// BUG: N+1 — makes 1 query for users + N queries for posts
export async function getUsersWithPostCounts(
  db: Database
): Promise<UserWithPostCount[]> {
  // Query 1: Fetch all users
  const users = (await db.query("SELECT_ALL_USERS")) as User[];

  const results: UserWithPostCount[] = [];

  // BUG: N queries — one for each user!
  for (const user of users) {
    const posts = (await db.query("SELECT_POSTS_BY_USER", [
      user.id,
    ])) as Post[];
    results.push({
      id: user.id,
      name: user.name,
      postCount: posts.length,
    });
  }

  return results;
}
