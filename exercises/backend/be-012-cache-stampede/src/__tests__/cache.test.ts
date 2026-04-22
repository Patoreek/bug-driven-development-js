import { cachedFetch, clearCache } from "../cache";

describe("Cache Stampede Prevention", () => {
  beforeEach(() => {
    clearCache();
  });

  it("returns cached value on cache hit", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return "data";
    };

    const result1 = await cachedFetch("key1", fetchFn, 10000);
    const result2 = await cachedFetch("key1", fetchFn, 10000);

    expect(result1).toBe("data");
    expect(result2).toBe("data");
    expect(callCount).toBe(1);
  });

  it("fetches fresh data when cache expires", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return `data-${callCount}`;
    };

    const result1 = await cachedFetch("key1", fetchFn, 50);
    expect(result1).toBe("data-1");

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    const result2 = await cachedFetch("key1", fetchFn, 50);
    expect(result2).toBe("data-2");
    expect(callCount).toBe(2);
  });

  it("only calls fetchFn once for concurrent requests to same key", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      // Simulate slow database query
      await new Promise((resolve) => setTimeout(resolve, 50));
      return "expensive-data";
    };

    // Fire 10 concurrent requests for the same key
    const promises = Array.from({ length: 10 }, () =>
      cachedFetch("popular-key", fetchFn, 10000)
    );

    const results = await Promise.all(promises);

    // All should get the same result
    expect(results).toEqual(Array(10).fill("expensive-data"));
    // But fetchFn should only have been called ONCE
    expect(callCount).toBe(1);
  });

  it("allows concurrent requests for DIFFERENT keys", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return `data-${callCount}`;
    };

    const promises = [
      cachedFetch("key-a", fetchFn, 10000),
      cachedFetch("key-b", fetchFn, 10000),
      cachedFetch("key-c", fetchFn, 10000),
    ];

    await Promise.all(promises);

    // Each unique key should trigger its own fetch
    expect(callCount).toBe(3);
  });

  it("cleans up in-flight tracking after fetch completes", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return "data";
    };

    // First batch of concurrent requests
    const batch1 = Array.from({ length: 5 }, () =>
      cachedFetch("cleanup-key", fetchFn, 50)
    );
    await Promise.all(batch1);
    expect(callCount).toBe(1);

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Second batch should trigger exactly one more fetch
    const batch2 = Array.from({ length: 5 }, () =>
      cachedFetch("cleanup-key", fetchFn, 50)
    );
    await Promise.all(batch2);
    expect(callCount).toBe(2);
  });

  it("does not cache errors — subsequent requests retry", async () => {
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error("Database timeout");
      }
      return "recovered-data";
    };

    // First request should fail
    await expect(
      cachedFetch("error-key", fetchFn, 10000)
    ).rejects.toThrow("Database timeout");

    // Second request should retry (not serve cached error)
    const result = await cachedFetch("error-key", fetchFn, 10000);
    expect(result).toBe("recovered-data");
    expect(callCount).toBe(2);
  });

  it("propagates errors to all concurrent waiters", async () => {
    const fetchFn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      throw new Error("Fetch failed");
    };

    const promises = Array.from({ length: 5 }, () =>
      cachedFetch("fail-key", fetchFn, 10000)
    );

    const results = await Promise.allSettled(promises);

    // All should reject with the same error
    for (const result of results) {
      expect(result.status).toBe("rejected");
      if (result.status === "rejected") {
        expect(result.reason.message).toBe("Fetch failed");
      }
    }
  });
});
