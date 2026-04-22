import { describe, it, expect, vi } from "vitest";
import { getUsersWithPostCounts, type Database } from "../user-posts";

function createMockDb() {
  const queryLog: string[] = [];

  const users = [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" },
    { id: "u3", name: "Charlie" },
  ];

  const posts = [
    { id: "p1", userId: "u1", title: "Post 1" },
    { id: "p2", userId: "u1", title: "Post 2" },
    { id: "p3", userId: "u2", title: "Post 3" },
    // u3 has no posts
  ];

  const postCounts: Record<string, number> = {
    u1: 2,
    u2: 1,
    u3: 0,
  };

  const db: Database = {
    query: vi.fn(async (operation: string, params?: unknown[]) => {
      queryLog.push(operation);

      if (operation === "SELECT_ALL_USERS") {
        return users;
      }

      if (operation === "SELECT_POSTS_BY_USER" && params) {
        const userId = params[0] as string;
        return posts.filter((p) => p.userId === userId);
      }

      if (operation === "SELECT_POST_COUNTS_BY_USERS" && params) {
        const userIds = params[0] as string[];
        return userIds.map((id) => ({
          userId: id,
          postCount: postCounts[id] ?? 0,
        }));
      }

      return [];
    }),
  };

  return { db, queryLog, users, postCounts };
}

describe("getUsersWithPostCounts", () => {
  it("should return correct user data with post counts", async () => {
    const { db } = createMockDb();
    const result = await getUsersWithPostCounts(db);

    expect(result).toHaveLength(3);

    const alice = result.find((u) => u.name === "Alice");
    expect(alice).toBeDefined();
    expect(alice!.postCount).toBe(2);

    const bob = result.find((u) => u.name === "Bob");
    expect(bob).toBeDefined();
    expect(bob!.postCount).toBe(1);

    const charlie = result.find((u) => u.name === "Charlie");
    expect(charlie).toBeDefined();
    expect(charlie!.postCount).toBe(0);
  });

  it("should make at most 2 database queries (not N+1)", async () => {
    const { db, queryLog } = createMockDb();
    await getUsersWithPostCounts(db);

    // Should be exactly 2 queries: one for users, one for post counts
    // NOT 1 + N (which would be 4 for 3 users)
    expect(queryLog.length).toBeLessThanOrEqual(2);
  });

  it("should NOT call SELECT_POSTS_BY_USER for individual users", async () => {
    const { db, queryLog } = createMockDb();
    await getUsersWithPostCounts(db);

    const individualQueries = queryLog.filter(
      (q) => q === "SELECT_POSTS_BY_USER"
    );
    expect(individualQueries).toHaveLength(0);
  });

  it("should use a batched query for post counts", async () => {
    const { db, queryLog } = createMockDb();
    await getUsersWithPostCounts(db);

    expect(queryLog).toContain("SELECT_POST_COUNTS_BY_USERS");
  });

  it("should pass all user IDs to the batched query", async () => {
    const { db } = createMockDb();
    await getUsersWithPostCounts(db);

    const calls = (db.query as ReturnType<typeof vi.fn>).mock.calls;
    const batchCall = calls.find(
      (c: unknown[]) => c[0] === "SELECT_POST_COUNTS_BY_USERS"
    );

    expect(batchCall).toBeDefined();
    expect(batchCall![1]).toEqual([["u1", "u2", "u3"]]);
  });

  it("should return empty array when there are no users", async () => {
    const db: Database = {
      query: vi.fn(async () => []),
    };

    const result = await getUsersWithPostCounts(db);
    expect(result).toEqual([]);
  });

  it("should include all user fields in the result", async () => {
    const { db } = createMockDb();
    const result = await getUsersWithPostCounts(db);

    for (const user of result) {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("postCount");
      expect(typeof user.id).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.postCount).toBe("number");
    }
  });
});
