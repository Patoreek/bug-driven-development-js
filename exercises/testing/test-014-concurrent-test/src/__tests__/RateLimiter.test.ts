import { RateLimiter, AsyncQueue } from "../RateLimiter";

// BUG: Tests use real timers, hardcoded delays, and share a global limiter.
// They pass locally (fast machine) but fail in CI (slow machine).
// Some tests pass in isolation but fail when run together.

// BUG: Shared global instance -- tests leak state into each other
const limiter = new RateLimiter(3, 1000); // 3 calls per second

describe("RateLimiter", () => {
  // BUG: No beforeEach to reset the limiter or timers

  it("should allow calls within the limit", () => {
    expect(limiter.call()).toBe(true);
    expect(limiter.call()).toBe(true);
    expect(limiter.call()).toBe(true);
  });

  it("should reject calls over the limit", () => {
    // BUG: This test depends on the previous test having used up the quota
    // If run alone, it would pass because the limiter has 3 fresh calls
    // If run after the first test, it fails because the window hasn't reset
    expect(limiter.call()).toBe(false);
  });

  it("should reset after the time window", async () => {
    // BUG: Uses real setTimeout to wait for the window to pass
    // On a slow CI machine, 1000ms might not be enough due to overhead
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // BUG: Depends on real time passing -- flaky
    expect(limiter.call()).toBe(true);
  }, 5000);

  it("should track remaining calls correctly", () => {
    // BUG: Depends on the state left by previous tests
    const remaining = limiter.getRemainingCalls();
    // BUG: This assertion is unpredictable because it depends on
    // whether the previous test's window has expired
    expect(remaining).toBeGreaterThanOrEqual(0);
  });

  it("should calculate time until reset", async () => {
    // BUG: Create a new limiter but still use real timers
    const fresh = new RateLimiter(2, 500);
    fresh.call();
    fresh.call();

    // BUG: Hardcoded delay -- assumes 200ms is "roughly in the middle"
    await new Promise((resolve) => setTimeout(resolve, 200));

    const timeLeft = fresh.getTimeUntilReset();
    // BUG: Flaky range assertion -- depends on actual elapsed time
    expect(timeLeft).toBeGreaterThan(200);
    expect(timeLeft).toBeLessThan(400);
  }, 5000);

  it("should handle async calls", async () => {
    const fresh = new RateLimiter(2, 1000);
    const results: number[] = [];

    const fn = async (n: number) => {
      // BUG: Real delay in the async function
      await new Promise((resolve) => setTimeout(resolve, 50));
      results.push(n);
      return n;
    };

    await fresh.callAsync(() => fn(1));
    await fresh.callAsync(() => fn(2));

    expect(results).toEqual([1, 2]);

    // Should reject the third call
    await expect(fresh.callAsync(() => fn(3))).rejects.toThrow(
      "Rate limit exceeded"
    );
  }, 5000);
});

describe("AsyncQueue", () => {
  // BUG: Shared queue instance
  const queue = new AsyncQueue(2);

  it("should process tasks with concurrency limit", async () => {
    const order: string[] = [];

    const task = (id: string, delay: number) => async () => {
      order.push(`start-${id}`);
      // BUG: Real delays make this test slow and timing-dependent
      await new Promise((resolve) => setTimeout(resolve, delay));
      order.push(`end-${id}`);
    };

    const p1 = queue.add(task("a", 100));
    const p2 = queue.add(task("b", 50));
    const p3 = queue.add(task("c", 50));

    await Promise.all([p1, p2, p3]);

    // BUG: Asserts exact order, but timing is non-deterministic
    // b (50ms) should finish before a (100ms), but on slow machines it might not
    expect(order).toEqual([
      "start-a", "start-b", "end-b", "start-c", "end-a", "end-c",
    ]);
  }, 5000);

  it("should report pending and active counts", async () => {
    // BUG: Queue still has state from the previous test
    const order: string[] = [];
    let resolveFirst!: () => void;
    let resolveSecond!: () => void;

    const p1 = queue.add(
      () => new Promise<void>((resolve) => { resolveFirst = resolve; })
    );
    const p2 = queue.add(
      () => new Promise<void>((resolve) => { resolveSecond = resolve; })
    );
    const p3 = queue.add(() => Promise.resolve());

    // BUG: Need to wait for microtasks to settle, but no mechanism to do so
    await new Promise((resolve) => setTimeout(resolve, 10));

    // BUG: These assertions depend on the queue processing speed
    expect(queue.active).toBe(2);
    expect(queue.pending).toBe(1);

    resolveFirst();
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(queue.active).toBe(2); // c should have started
    expect(queue.pending).toBe(0);

    resolveSecond();
    await Promise.all([p1, p2, p3]);
  }, 5000);
});
