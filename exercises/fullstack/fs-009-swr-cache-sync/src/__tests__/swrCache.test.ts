import { createCache } from "../swrCache";

describe("SWR-style cache", () => {
  it("stores and retrieves data", () => {
    const cache = createCache();
    cache.set("users", [{ id: 1, name: "Alice" }]);
    expect(cache.get("users")).toEqual([{ id: 1, name: "Alice" }]);
  });

  it("returns undefined for missing keys", () => {
    const cache = createCache();
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("returns undefined for stale entries", () => {
    const cache = createCache();
    // Set with a very short maxAge
    cache.set("users", [{ id: 1 }], 0);

    // Entry should be stale immediately
    expect(cache.get("users")).toBeUndefined();
  });

  it("isStale returns true for expired entries", () => {
    const cache = createCache();
    cache.set("users", [{ id: 1 }], 0);
    expect(cache.isStale("users")).toBe(true);
  });

  it("isStale returns false for fresh entries", () => {
    const cache = createCache();
    cache.set("users", [{ id: 1 }], 60000);
    expect(cache.isStale("users")).toBe(false);
  });

  it("isStale returns true for missing entries", () => {
    const cache = createCache();
    expect(cache.isStale("nonexistent")).toBe(true);
  });

  it("getOrFetch returns cached data if fresh", async () => {
    const cache = createCache();
    const fetcher = vi.fn().mockResolvedValue([{ id: 1, name: "Alice" }]);
    cache.registerFetcher("users", fetcher);
    cache.set("users", [{ id: 1, name: "Alice" }], 60000);

    const result = await cache.getOrFetch("users");
    expect(result).toEqual([{ id: 1, name: "Alice" }]);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("getOrFetch refetches when cache is stale", async () => {
    const cache = createCache();
    const fetcher = vi.fn().mockResolvedValue([{ id: 1, name: "Updated Alice" }]);
    cache.registerFetcher("users", fetcher);
    cache.set("users", [{ id: 1, name: "Old Alice" }], 0);

    const result = await cache.getOrFetch("users");
    expect(fetcher).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, name: "Updated Alice" }]);
  });

  it("getOrFetch fetches when no cached data exists", async () => {
    const cache = createCache();
    const fetcher = vi.fn().mockResolvedValue([{ id: 1 }]);
    cache.registerFetcher("users", fetcher);

    const result = await cache.getOrFetch("users");
    expect(fetcher).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it("getOrFetch returns undefined when no fetcher is registered", async () => {
    const cache = createCache();
    const result = await cache.getOrFetch("users");
    expect(result).toBeUndefined();
  });

  it("mutate with optimisticData updates cache immediately", async () => {
    const cache = createCache();
    cache.registerFetcher("users", async () => [{ id: 1, name: "Server" }]);

    await cache.mutate("users", {
      optimisticData: [{ id: 1, name: "Optimistic" }],
      revalidate: false,
    });

    expect(cache.get("users")).toEqual([{ id: 1, name: "Optimistic" }]);
  });

  it("mutate with revalidate refreshes from fetcher", async () => {
    const cache = createCache();
    cache.set("users", [{ id: 1, name: "Stale" }]);
    cache.registerFetcher("users", async () => [{ id: 1, name: "Fresh" }]);

    const result = await cache.mutate("users", { revalidate: true });
    expect(result).toEqual([{ id: 1, name: "Fresh" }]);
  });

  it("clear removes all entries and fetchers", async () => {
    const cache = createCache();
    cache.set("users", [{ id: 1 }]);
    cache.registerFetcher("users", async () => []);

    cache.clear();

    expect(cache.get("users")).toBeUndefined();
    const result = await cache.getOrFetch("users");
    expect(result).toBeUndefined();
  });
});
