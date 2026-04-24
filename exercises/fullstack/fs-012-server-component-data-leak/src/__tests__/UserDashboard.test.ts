import { describe, it, expect, beforeEach } from "vitest";
import { getUserDashboardData, getDashboardCacheKey } from "../UserDashboard";
import { getFetchCalls, resetFetchCalls } from "../api";

describe("UserDashboard - per-user data isolation", () => {
  beforeEach(() => {
    resetFetchCalls();
  });

  it("returns correct profile data for user-1", () => {
    const data = getUserDashboardData("user-1");

    expect(data.profile).not.toBeNull();
    expect(data.profile!.name).toBe("Alice");
    expect(data.profile!.email).toBe("alice@example.com");
  });

  it("returns correct profile data for user-2", () => {
    const data = getUserDashboardData("user-2");

    expect(data.profile).not.toBeNull();
    expect(data.profile!.name).toBe("Bob");
    expect(data.profile!.email).toBe("bob@example.com");
  });

  it("returns correct billing data per user", () => {
    const data1 = getUserDashboardData("user-1");
    const data2 = getUserDashboardData("user-2");

    expect(data1.billing!.cardLast4).toBe("4242");
    expect(data1.billing!.plan).toBe("enterprise");

    expect(data2.billing!.cardLast4).toBe("1234");
    expect(data2.billing!.plan).toBe("basic");
  });

  it("returns correct orders per user", () => {
    const data1 = getUserDashboardData("user-1");
    const data2 = getUserDashboardData("user-2");

    expect(data1.orders[0].item).toBe("Widget Pro");
    expect(data2.orders[0].item).toBe("Gadget Basic");
  });
});

describe("UserDashboard - fetch cache configuration", () => {
  beforeEach(() => {
    resetFetchCalls();
  });

  it("all fetch calls use cache: no-store to prevent cross-user caching", () => {
    getUserDashboardData("user-1");
    const calls = getFetchCalls();

    expect(calls.length).toBeGreaterThanOrEqual(3); // profile, billing, orders

    for (const call of calls) {
      expect(call.options.cache).toBe("no-store");
    }
  });

  it("fetch calls include user-specific next.tags for targeted revalidation", () => {
    getUserDashboardData("user-1");
    const calls = getFetchCalls();

    for (const call of calls) {
      const tags = call.options.next?.tags ?? [];
      // Each fetch should have a tag that includes the user ID
      const hasUserTag = tags.some((tag: string) => tag.includes("user-1"));
      expect(hasUserTag).toBe(true);
    }
  });

  it("different users produce different cache tags", () => {
    getUserDashboardData("user-1");
    getUserDashboardData("user-2");
    const calls = getFetchCalls();

    const user1Tags = calls
      .filter((_, i) => i < 3)
      .flatMap((c) => c.options.next?.tags ?? []);
    const user2Tags = calls
      .filter((_, i) => i >= 3)
      .flatMap((c) => c.options.next?.tags ?? []);

    // Tags should not overlap between users
    const overlap = user1Tags.filter((t: string) => user2Tags.includes(t));
    expect(overlap).toHaveLength(0);
  });
});

describe("UserDashboard - cache key includes user ID", () => {
  it("generates unique cache keys per user", () => {
    const key1 = getDashboardCacheKey("user-1");
    const key2 = getDashboardCacheKey("user-2");

    expect(key1).not.toBe(key2);
    expect(key1).toContain("user-1");
    expect(key2).toContain("user-2");
  });

  it("same user always gets same cache key", () => {
    const key1a = getDashboardCacheKey("user-1");
    const key1b = getDashboardCacheKey("user-1");

    expect(key1a).toBe(key1b);
  });
});

describe("UserDashboard - error handling", () => {
  it("returns error for unknown user", () => {
    const data = getUserDashboardData("nonexistent");

    expect(data.error).toBe("User not found");
    expect(data.profile).toBeNull();
  });
});
